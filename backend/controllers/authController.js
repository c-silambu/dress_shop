const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logMailError } = require("../utils/mailer");
const { configured: mailConfigured, sendPasswordResetEmail } = require("../utils/emailService");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const phoneDigits = (value) => String(value || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone });
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phoneQuery = (value) => {
  const digits = phoneDigits(value);
  if (digits.length !== 10) return null;
  // Also matches legacy values saved as +91 98765-43210 or with spaces.
  return { $or: [{ phone: digits }, { phone: new RegExp(`(?:\\+?91\\D*)?${digits.split("").join("\\D*")}$`) }] };
};

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = phoneDigits(req.body.phone);
    const password = String(req.body.password || "");
    if (!name || !/^\S+$/u.test(name) || !/^\S+@\S+\.\S+$/.test(email) || phone.length !== 10 || password.length < 6) return res.status(400).json({ message: "Enter a username without spaces, valid email, 10-digit phone number and password of at least 6 characters" });
    if (await User.exists({ name: new RegExp(`^${escapeRegex(name)}$`, "i") })) return res.status(409).json({ message: "This username is already taken" });
    if (await User.findOne(phoneQuery(phone))) return res.status(409).json({ message: "This phone number is already registered. Please log in." });
    if (email && await User.exists({ email })) return res.status(409).json({ message: "This email is already registered" });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: sign(user._id), user: publicUser(user) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const identifier = String(req.body.identifier || req.body.email || req.body.phone || "").trim();
    const password = String(req.body.password || "");
    if (!identifier || !password) return res.status(400).json({ message: "Enter your email or phone number and password" });
    const isEmail = identifier.includes("@");
    const query = isEmail ? { email: identifier.toLowerCase() } : phoneQuery(identifier);
    if (!query) return res.status(400).json({ message: "Enter a valid email or 10-digit phone number" });
    const user = await User.findOne(query);
    const passwordIsHashed = user && /^\$2[aby]\$/.test(user.password || "");
    const valid = user && (passwordIsHashed
      ? await bcrypt.compare(password, user.password)
      : password === String(user.password || ""));
    if (!valid) return res.status(401).json({ message: "Email/phone number or password is incorrect" });
    // Upgrade legacy plain-text passwords after the first successful login.
    if (!passwordIsHashed) {
      user.password = await bcrypt.hash(password, 12);
      await user.save({ validateBeforeSave: false });
    }
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address" });

    const user = await User.findOne({ email });
    // Always return the same message so registered email addresses cannot be discovered.
    const response = { message: "If an account uses this email, a password reset link has been sent." };
    if (!user) {
      console.log("[mail] password-reset:account-not-found", { emailDomain: email.split("@")[1] });
      return res.json(response);
    }
    if (!mailConfigured()) {
      console.error("[mail] password-reset:skipped because the selected mail provider is not fully configured");
      return res.status(503).json({ message: "Password reset email is not configured. Please contact support." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail({ user, token });
      console.log("[mail] password-reset:sent", { userId: user._id.toString() });
    } catch (mailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      try {
        await user.save({ validateBeforeSave: false });
      } catch (cleanupError) {
        console.error("[mail] password-reset:token-cleanup-failed", { userId: user._id.toString(), message: cleanupError.message });
      }
      logMailError("password-reset", mailError, { userId: user._id.toString() });
      return res.status(502).json({ message: "Could not send the reset email. Please try again later." });
    }
    res.json(response);
  } catch (error) {
    console.error("[mail] password-reset:controller-failed", { message: error.message, code: error.code });
    res.status(500).json({ message: "Unable to process password reset right now" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const password = String(req.body.password || "");
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const hashedToken = crypto.createHash("sha256").update(String(req.params.token || "")).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } }).select("+passwordResetToken +passwordResetExpires");
    if (!user) return res.status(400).json({ message: "This reset link is invalid or has expired" });
    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ message: "Password changed successfully. You can now log in." });
  } catch (error) { res.status(500).json({ message: "Unable to reset password right now" }); }
};

exports.adminLogin = (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) return res.json({ token: jwt.sign({ admin: true, username }, process.env.JWT_SECRET, { expiresIn: "7d" }), admin: { username } });
  res.status(401).json({ message: "Invalid admin credentials" });
};
