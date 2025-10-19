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

module.exports = router;
