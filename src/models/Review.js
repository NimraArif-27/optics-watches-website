const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCategory: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
  images: { type: [String], default: [] }, // array of image URLs or filenames
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
