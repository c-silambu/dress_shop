const Product = require("../models/Product");

const normalize = (body) => {
  return {
    ...body,
    price: body.price ? Number(body.price) : undefined,
    discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
    stock: body.stock ? Number(body.stock) : 0,
    sizes: Array.isArray(body.sizes)
      ? body.sizes
      : String(body.sizes || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    colors: Array.isArray(body.colors)
      ? body.colors
      : String(body.colors || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
    images: Array.isArray(body.images)
      ? body.images
      : String(body.images || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  };
};

exports.createProduct = async (req, res) => {
  try {
    const data = normalize(req.body);
    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (uploadedImages.length) {
      data.images = uploadedImages;
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      query.mainCategory = req.query.category;
    }

    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const products = await Product.find(query).sort("-createdAt");
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
    const update = normalize(req.body);
    const uploadedImages = (req.files || []).map((file) => `/uploads/${file.filename}`);

    if (uploadedImages.length) {
      update.images = uploadedImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
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
    const products = await Product.find({ mainCategory: req.params.category, status: "Active" }).sort("-createdAt");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
