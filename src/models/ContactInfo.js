const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" }
});

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
