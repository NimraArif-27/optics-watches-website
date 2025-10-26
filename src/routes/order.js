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

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error fetching order" });
  }
});


// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE ORDER STATUS WITH STOCK CHECK
router.put("/:id/accept", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const items = order.items;

    // Check stock for each item
    for (let item of items) {
      let product =
        (await Eyeglass.findById(item.productId)) ||
        (await Sunglass.findById(item.productId)) ||
        (await Lens.findById(item.productId)) ||
        (await Watch.findById(item.productId));

      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${item.name}. Available: ${product.stock}, Ordered: ${item.qty}`
        });
      }
    }

    // Deduct stock
    for (let item of items) {
      let product =
        (await Eyeglass.findById(item.productId)) ||
        (await Sunglass.findById(item.productId)) ||
        (await Lens.findById(item.productId)) ||
        (await Watch.findById(item.productId));

      product.stock -= item.qty;
      await product.save();
    }

    // Update order status
    order.orderStatus = "accepted";
    await order.save();

    res.status(200).json({ message: "Order accepted", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/orders/:id/reject
router.put("/:id/reject", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = "rejected";
    await order.save();

    res.json({ message: "Order rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/dispatch", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDispatched = true;
    await order.save();

    res.json({ message: "Order dispatched successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
