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

// GET - fetch all contact form messages
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: 1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;
