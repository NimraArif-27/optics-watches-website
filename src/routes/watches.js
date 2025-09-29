const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Storage config (uploads to public/uploads/watches)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../..", "public", "uploads", "watches"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Product Model
const Watches = require("../models/Watches");

// POST - Add Product
router.post(
  "/add",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const { name, description, price, stock, category, ageGroup } = req.body;

      const mainImage = req.files["mainImage"]
        ? `/uploads/watches/${req.files["mainImage"][0].filename}`
        : null;

      const subImages = req.files["subImages"]
        ? req.files["subImages"].map((f) => `/uploads/watches/${f.filename}`)
        : [];

      const newProduct = new Watches({
        name,
        description,
        price,
        stock,
        category,
        ageGroup: category === "kidsWatches" ? ageGroup : undefined,
        mainImage,
        subImages,
      });

      await newProduct.save();
      res.json({ success: true, product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Related products for products page
router.get("/related/:category/:excludeId", async (req, res) => {
  try {
    const { category, excludeId } = req.params;
    const products = await Watches.find({
      category,
      _id: { $ne: excludeId }
    }).limit(4);

    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching related products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get products by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Watches.find({ category });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/watches/product/:id
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Watches.findById(req.params.id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: "Error fetching product" });
  }
});

// Update product
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Watches.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Error updating watch:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete product
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Watches.findByIdAndDelete(id);

    if (!deleted) return res.json({ success: false, message: "Product not found" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error deleting product" });
  }
});

module.exports = router;
