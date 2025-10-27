const express = require("express");
const Review = require("../models/Review");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../public/uploads/reviews"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { files: 3 } }); // max 3 files

// POST new review with optional images
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { productName, productCategory, name, email, rating, feedback } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/reviews/${file.filename}`) : [];

    const newReview = new Review({
      productName,
      productCategory,
      name,
      email,
      rating,
      feedback,
      images
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to save review" });
  }
});

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET single review by ID (needed for View button)
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// PUT: Publish a review (toggle isPublished)
// Publish/unpublish a review
router.put("/publish/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { published: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to publish review" });
  }
});



// DELETE review by ID
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
