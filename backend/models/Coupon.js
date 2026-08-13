const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
  value: { type: Number, required: true, min: 0 },
  minimumOrder: { type: Number, min: 0, default: 0 },
  maximumDiscount: { type: Number, min: 0, default: 0 },
  startDate: Date,
  expiryDate: Date,
  usageLimit: { type: Number, min: 0, default: 0 },
  perUserLimit: { type: Number, min: 0, default: 1 },
  firstOrderOnly: { type: Boolean, default: false },
  subscriberOnly: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  usedCount: { type: Number, default: 0 },
}, { timestamps: true });

schema.pre("validate", function validateCoupon() {
  if (this.type === "percentage" && this.value > 100) {
    this.invalidate("value", "Percentage discount cannot be more than 100%");
  }
});

module.exports = mongoose.model("Coupon", schema);
