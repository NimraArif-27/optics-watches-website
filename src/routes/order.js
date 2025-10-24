const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Your 4 product models
const Eyeglass = require("../models/Eyeglasses");
const Sunglass = require("../models/Sunglasses");
const Lens = require("../models/Lenses");
const Watch = require("../models/Watches");

// Helper function to fetch product details from all collections
async function getProductDetailsById(id) {
  return (
    (await Eyeglass.findById(id)) ||
    (await Sunglass.findById(id)) ||
    (await Lens.findById(id)) ||
    (await Watch.findById(id))
  );
}

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { userId, items, deliveryAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch product details for each item
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await getProductDetailsById(item.id || item.productId);
        if (!product) throw new Error(`Product not found: ${item.id || item.productId}`);

        const subtotal = item.price * item.qty;
        return {
          productId: product._id,
          name: product.name,
          price: item.price,
          qty: item.qty,
          power: item.power || { right: "", left: "" },
          brand: product.brand || "",
          color: product.color || "",
          ageGroup: product.ageGroup || "",
          category: product.category || product.constructor.modelName, // fallback
          subtotal,
        };
      })
    );

    const newOrder = new Order({
      userId,
      items: processedItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
