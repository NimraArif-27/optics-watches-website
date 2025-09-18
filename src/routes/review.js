const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST new review
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    const newReview = new Review({ name, email, rating, feedback });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ error: "Failed to save review" });
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
