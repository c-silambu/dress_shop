require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/favourites", require("./routes/favouriteRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/store", require("./routes/storeRoutes"));

app.get("/api/version", (req, res) => {
  const { configured: mailConfigured } = require("./utils/mailer");
  res.json({ version: process.env.RENDER_GIT_COMMIT?.slice(0, 7) || "local", mailConfigured: mailConfigured() });
});

app.get("/", (req, res) => {
  res.json({ message: "Women’s Styles API running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Women’s Styles API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
