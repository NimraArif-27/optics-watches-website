const mongoose = require("mongoose");

const eyeglassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: {
    type: String,
    enum: ["metalFrames", "regularGlasses", "brandedFrames", "kidsEyeglasses"],
    required: true,
  },
  ageGroup: {
    type: String,
    required: function () {
      return this.category === "kidsEyeglasses";
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

module.exports = mongoose.model("Eyeglass", eyeglassSchema);

