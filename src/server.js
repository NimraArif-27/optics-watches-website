const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const contactRoutes = require("./routes/contact");
const contactInfoRoutes = require("./routes/contactInfo");
const reviewRoutes = require("./routes/review");
const eyeglassesRoutes = require("./routes/eyeglasses");
const sunglassesRoutes = require("./routes/sunglasses");
const watchesRoutes = require("./routes/watches");



const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/contact", contactRoutes);
app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/eyeglasses", eyeglassesRoutes);
app.use("/api/sunglasses", sunglassesRoutes);
app.use("/api/watches", watchesRoutes);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

// Route: index.html at "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Route: admin-dashboard.html at "/admin"
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin-dashboard.html"));
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
