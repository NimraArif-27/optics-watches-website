const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST - save contact form data
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message saved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
