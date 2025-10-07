const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../..", "public", "uploads", "lenses"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Lens model
const Lenses = require("../models/Lenses");

// POST - Add Lens
router.post(
  "/add",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      let { name, description, price, stock, brand, color, lensType, category } = req.body;

      // Normalize color
      color = color
        ? color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
        : "Clear";

      // Use category from frontend; fallback just in case
      if (!["PowerLenses", "ColoredLenses"].includes(category)) {
        category = "ColoredLenses";
      }

      const mainImage = req.files["mainImage"]
        ? `/uploads/lenses/${req.files["mainImage"][0].filename}`
        : null;

      const subImages = req.files["subImages"]
        ? req.files["subImages"].map((f) => `/uploads/lenses/${f.filename}`)
        : [];

      const newLens = new Lenses({
        name,
        description,
        price,
        stock,
        category,
        brand,
        color,
        lensType: category === "PowerLenses" ? lensType || "Single Vision" : undefined,
        mainImage,
        subImages,
      });

      await newLens.save();
      res.json({ success: true, product: newLens });
    } catch (err) {
      console.error("❌ Error adding lens:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);


// GET - Products by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Lenses.find({ category });
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Error fetching lenses:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET - Single lens by ID
router.get("/product/:id", async (req, res) => {
  try {
    const product = await Lenses.findById(req.params.id);
    if (!product) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    console.error("❌ Error fetching lens:", err);
    res.json({ success: false, message: "Error fetching product" });
  }
});

// PATCH - Update lens
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.category === "PowerLenses") {
      updates.lensType = updates.lensType || "Single Vision";
    }

    const product = await Lenses.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error("❌ Error updating lens:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE - Remove lens
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Lenses.findByIdAndDelete(req.params.id);
    if (!deleted) return res.json({ success: false, message: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting lens:", err);
    res.json({ success: false, message: "Error deleting product" });
  }
});

module.exports = router;
