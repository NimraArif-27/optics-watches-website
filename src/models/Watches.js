const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: {
    type: String,
    enum: ["gentsWatches", "ladiesWatches", "premiumWatches", "kidsWatches"],
    required: true,
  },
  ageGroup: {
    type: String,
    required: function () {
      return this.category === "kidsWatches";
    },
    enum: [
      "3-5 years",
      "6-8 years",
      "9-12 years",
      "13-15 years",
    ],
  },
  mainImage: { type: String, required: true },
  subImages: [String],
}, { timestamps: true });

module.exports = mongoose.model("Watch", watchSchema);
