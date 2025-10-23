const express = require("express");
const router = express.Router();

// Mongoose models
const Eyeglass = require("../models/Eyeglasses");
const Sunglass = require("../models/Sunglasses");
const Lens = require("../models/Lenses");
const Watch = require("../models/Watches");

// GET /api/products/stock
router.get("/stock", async (req, res) => {
  try {
    const eyeglasses = await Eyeglass.find({}, "name category stock");
    const sunglasses = await Sunglass.find({}, "name category stock");
    const lenses = await Lens.find({}, "name category stock");
    const watches = await Watch.find({}, "name category stock");

    const products = [...eyeglasses, ...sunglasses, ...lenses, ...watches];

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET /api/products/:id → fetch product details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the product in all collections
    const product =
      (await Eyeglass.findById(id)) ||
      (await Sunglass.findById(id)) ||
      (await Lens.findById(id)) ||
      (await Watch.findById(id));

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
