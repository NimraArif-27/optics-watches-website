const express = require("express");
const router = express.Router();
const ContactInfo = require("../models/ContactInfo");

// ✅ Get contact info (for user & admin)
router.get("/", async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      // auto-create default record if not found
      contact = new ContactInfo({
        address: "Default Address",
        phone: "0000000000",
        email: "default@example.com"
      });
      await contact.save();
    }
    res.json(contact);
  } catch (err) {
    console.error("❌ GET /api/contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PATCH contact info (partial update)
router.patch("/", async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = new ContactInfo();
    }

    // only update fields that exist in request body
    if (req.body.address !== undefined) contact.address = req.body.address;
    if (req.body.phone !== undefined) contact.phone = req.body.phone;
    if (req.body.email !== undefined) contact.email = req.body.email;

    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error("❌ PATCH /api/contact-info error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
