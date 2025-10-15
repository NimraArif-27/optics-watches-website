const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema({
  estimatedDelivery: { type: String, default: "3-5 Business Days" },
  specialOfferText: { type: String, default: "Free delivery on orders above Rs. 2000!" },
  freeDeliveryAbove: { type: Number, default: 2000 },
  deliveryCharges: { type: Number, default: 200 },
  returnPolicy: { type: String, default: "30-day easy returns." },
  businessHours: { type: String, default: "Mon - Sat: 10:00 AM - 8:00 PM" }
});

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
