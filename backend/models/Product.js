const mongoose = require("mongoose");

const colourSchema = new mongoose.Schema({ name: String, hex: String, stock: { type: Number, min: 0, default: 0 } }, { _id: false });
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, lowercase: true },
  sku: { type: String, trim: true, uppercase: true, sparse: true },
  mainCategory: { type: String, required: true, trim: true },
  subCategory: { type: String, trim: true }, brand: String,
  price: { type: Number, required: true, min: 0 }, discountPrice: { type: Number, min: 0 }, compareAtPrice: { type: Number, min: 0 },
  about: String, description: String, images: [String], sizes: [String], colors: [String], colourOptions: [colourSchema],
  fabric: String, pattern: String, materialType: String, sleeveType: String, neckType: String, fit: String, occasion: String, style: String,
  length: String, countryOfOrigin: { type: String, default: "India" }, washCare: String, sizeChart: String, tags: [String],
  stock: { type: Number, min: 0, default: 0 }, lowStockThreshold: { type: Number, min: 0, default: 5 }, soldCount: { type: Number, min: 0, default: 0 },
  featured: { type: Boolean, default: false }, bestseller: { type: Boolean, default: false }, newArrival: { type: Boolean, default: false },
  status: { type: String, enum: ["Active", "Inactive", "Draft"], default: "Active" },
}, { timestamps: true });

productSchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (this.discountPrice != null && this.discountPrice > this.price) this.invalidate("discountPrice", "Sale price cannot exceed regular price");
  const jewellery = /jewell?ery/i.test(this.mainCategory || "");
  if (!this.sizes?.length) this.invalidate("sizes", jewellery ? "Jewellery size or Free Size is required" : "At least one dress size is required");
  if (jewellery && !this.materialType?.trim()) this.invalidate("materialType", "Material type is required for jewellery");
  if (!jewellery && !this.colors?.length) this.invalidate("colors", "At least one colour is required for dresses");
  if (!jewellery && !this.fabric?.trim()) this.invalidate("fabric", "Fabric is required for dresses");
  if (!jewellery && !this.pattern?.trim()) this.invalidate("pattern", "Pattern is required for dresses");
});
productSchema.index({ name: "text", description: "text", tags: "text" });
module.exports = mongoose.model("Product", productSchema);
