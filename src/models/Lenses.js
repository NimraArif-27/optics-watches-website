const mongoose = require("mongoose");

const lensSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },

    category: {
      type: String,
      enum: ["PowerLenses", "ColoredLenses"], // two categories
      required: true,
    },

    // Common fields
    brand: { type: String, required: true },
    color: {
      type: String,
      required: true, // force everyone to provide a color
      default: "Clear", // default only if not provided
    },


    // Power lenses specific field
    lensType: {
      type: String,
      required: function () {
        return this.category === "PowerLenses";
      },
      enum: ["Single Vision"],
    },

    // Images
    mainImage: { type: String, required: true },
    subImages: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lens", lensSchema);
