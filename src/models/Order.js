const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: String,
      price: Number,
      qty: Number,
      power: {
        right: String,
        left: String
      },
      brand: String,
      color: String,
      ageGroup: String,
      category: String,        // ✅ Add category here
      subtotal: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    fullname: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    postal: String
  },
  paymentMethod: { type: String, default: "COD" },
  orderStatus: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
