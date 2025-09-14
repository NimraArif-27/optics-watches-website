const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const shopInfoRoutes = require("./routes/shopInfo");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API routes
app.use("/api/shopInfo", shopInfoRoutes);

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
