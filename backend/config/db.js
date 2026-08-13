const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Coupon = require('../models/Coupon');
    await Coupon.updateOne(
      { code: 'NEW20' },
      { $setOnInsert: { description: 'New user 20% off', type: 'percentage', value: 20, minimumOrder: 0, maximumDiscount: 0, perUserLimit: 1, firstOrderOnly: true, active: true } },
      { upsert: true }
    );
    console.log('MongoDB connected');
  }
  catch (err) { console.error('MongoDB connection failed:', err.message); process.exit(1); }
};
module.exports = connectDB;
