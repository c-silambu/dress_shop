const Product = require("../models/Product");
const Category = require("../models/Category");

const flexibleName = (value) => {
  const words = String(value || "").match(/[a-z0-9]+/gi) || [];
  return new RegExp(`^${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[\\s'’_-]*")}$`, "i");
};

const normalize = (body) => {
  const list = (value) => Array.isArray(value) ? value : String(value || "").split(",").map(item => item.trim()).filter(Boolean);
  const bool = (value) => value === true || value === "true" || value === "on";
  const data = {
    ...body,
    price: body.price ? Number(body.price) : undefined,
    discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
    stock: body.stock ? Number(body.stock) : 0,
    lowStockThreshold: body.lowStockThreshold === undefined ? undefined : Number(body.lowStockThreshold),
    sizes: list(body.sizes), colors: list(body.colors), tags: list(body.tags),
    featured: bool(body.featured), bestseller: bool(body.bestseller), newArrival: bool(body.newArrival),
    images: Array.isArray(body.images)
      ? body.images
      : String(body.images || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  };
  const jewellery = /jewell?ery/i.test(data.mainCategory || "");
  if (jewellery) {
    data.colors = [];
    data.colourOptions = [];
    data.fabric = "";
    data.pattern = "";
    data.sleeveType = "";
    data.neckType = "";
    data.fit = "";
    data.washCare = "";
  } else {
    data.materialType = "";
  }
  return data;
};

const validateTypeFields = (data) => {
  const jewellery = /jewell?ery/i.test(data.mainCategory || "");
  if (!data.sizes?.length) return jewellery ? "Select a jewellery size or Free Size" : "Select at least one dress size";
  if (jewellery && !String(data.materialType || "").trim()) return "Material type is required for jewellery";
  if (!jewellery && !data.colors?.length) return "At least one colour is required for dresses";
  if (!jewellery && !String(data.fabric || "").trim()) return "Fabric is required for dresses";
  if (!jewellery && !String(data.pattern || "").trim()) return "Pattern is required for dresses";
  return "";
};

exports.createProduct = async (req, res) => {
  try {
    const data = normalize(req.body);
    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (!data.mainCategory || !data.subCategory) {
      return res.status(400).json({ message: "Category and subcategory are required" });
    }
    if (!data.about || !data.description) {
      return res.status(400).json({ message: "About product and description are required" });
    }
    const typeError = validateTypeFields(data);
    if (typeError) return res.status(400).json({ message: typeError });
    const [mainCategory, subCategory] = await Promise.all([
      Category.findOne({ name: data.mainCategory, parent: { $in: ["", null] }, active: true }),
      Category.findOne({ name: data.subCategory, parent: data.mainCategory, active: true }),
    ]);
    if (!mainCategory || !subCategory) {
      return res.status(400).json({ message: "Choose a valid category and subcategory from the admin catalogue" });
    }
    data.images = [...(data.images || []), ...uploadedImages];
    if (data.images.length !== 3) {
      return res.status(400).json({ message: "Please provide exactly 3 product images or image URLs" });
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.bulkCreateProducts = async (req, res) => {
  try {
    const products = Array.isArray(req.body) ? req.body.map(normalize) : [];
    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ message: `${createdProducts.length} products added successfully`, products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.mainCategory = String(req.query.category).trim().toLowerCase() === "dress"
        ? /dress/i
        : flexibleName(req.query.category);
    }

    if (req.query.subCategory) {
      query.subCategory = flexibleName(req.query.subCategory);
    }

    if (req.query.search) {
      const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [{ name: { $regex: escaped, $options: "i" } }, { description: { $regex: escaped, $options: "i" } }];
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    ['brand','fabric','pattern','sleeveType','neckType','fit','occasion','style'].forEach(k=>{if(req.query[k])query[k]=req.query[k]});
    if(req.query.size) query.sizes=req.query.size; if(req.query.color) query.colors=req.query.color;
    if(req.query.minPrice||req.query.maxPrice) query.price={...(req.query.minPrice&&{$gte:Number(req.query.minPrice)}),...(req.query.maxPrice&&{$lte:Number(req.query.maxPrice)})};
    ['featured','bestseller','newArrival'].forEach(k=>{if(req.query[k]!==undefined)query[k]=req.query[k]==='true'});
    const sorts={featured:'-featured -createdAt',bestSelling:'-soldCount',newest:'-createdAt',oldest:'createdAt',priceAsc:'discountPrice price',priceDesc:'-discountPrice -price',nameAsc:'name',nameDesc:'-name'};
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = requestedLimit ? Math.min(100, Math.max(1, requestedLimit)) : 0;
    const productQuery = Product.find(query).sort(sorts[req.query.sort]||"-createdAt");
    if (limit) productQuery.skip((page - 1) * limit).limit(limit);
    let products;
    let total;
    if (limit) {
      [products, total] = await Promise.all([productQuery, Product.countDocuments(query)]);
    } else {
      products = await productQuery;
      total = products.length;
    }
    res.set("X-Total-Count", String(total));
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Product not found" });
    const update = normalize({ ...existing.toObject(), ...req.body });
    const typeError = validateTypeFields(update);
    if (typeError) return res.status(400).json({ message: typeError });
    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (uploadedImages.length) {
      update.images = uploadedImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.byCategory = async (req, res) => {
  try {
    const products = await Product.find({ mainCategory: flexibleName(req.params.category), status: "Active" }).sort("-createdAt");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
