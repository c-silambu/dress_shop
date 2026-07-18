const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

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
    const valid = user && /^\$2[aby]\$/.test(user.password) && await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Email/phone number or password is incorrect" });
    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const mailTransport = () => {
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS;
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  }
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address" });

    const user = await User.findOne({ email });
    // Always return the same message so registered email addresses cannot be discovered.
    const response = { message: "If an account uses this email, a password reset link has been sent." };
    if (!user) return res.json(response);
    const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
    const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;
    if (!mailUser || !mailPass) {
      return res.status(503).json({ message: "Password reset email is not configured. Please contact support." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = String(process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    try {
      await mailTransport().sendMail({
        from: process.env.MAIL_FROM ? `${process.env.MAIL_FROM} <${mailUser}>` : mailUser,
        to: user.email,
        subject: "Reset your Women's Styles password",
        text: `Reset your password using this link (valid for 15 minutes): ${resetUrl}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>Reset your password</h2><p>This link is valid for 15 minutes.</p><p><a href="${resetUrl}" style="background:#a91d4b;color:#fff;padding:12px 18px;text-decoration:none">Set new password</a></p><p>If you did not request this, you can ignore this email.</p></div>`
      });
    } catch (mailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error("Password reset email failed:", mailError.message);
      return res.status(502).json({ message: "Could not send the reset email. Please try again later." });
    }
    res.json(response);
  } catch (error) { res.status(500).json({ message: "Unable to process password reset right now" }); }
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
