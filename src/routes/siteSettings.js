const express = require("express");
const router = express.Router();
const SiteSetting = require("../models/SiteSetting");

// Get settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update settings
router.put("/", async (req, res) => {
  try {
    const update = req.body;
    const settings = await SiteSetting.findOneAndUpdate({}, update, { new: true, upsert: true });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
