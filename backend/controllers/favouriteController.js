const Favourite = require("../models/Favourite");

const getUserId = (req) => req.user?._id || req.user?.id;

exports.add = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Please login to add favourite" });
    }

    if (!req.body.product) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const existingFavourite = await Favourite.findOne({
      user: userId,
      product: req.body.product,
    });

    if (existingFavourite) {
      return res.status(200).json({ message: "Already favourite", favourite: existingFavourite });
    }

    const favourite = await Favourite.create({ user: userId, product: req.body.product });
    res.status(201).json(favourite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Please login to view favourites" });
    }

    const favourites = await Favourite.find({ user: userId }).populate("product");
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Please login to remove favourite" });
    }

    await Favourite.findOneAndDelete({ _id: req.params.id, user: userId });
    res.json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
