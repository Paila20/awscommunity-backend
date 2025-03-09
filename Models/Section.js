const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  description: { type: String },
  sectionMenu: { type: String, required: true },
  attachForm: { type: Boolean, default: false }
});

module.exports = mongoose.model("Section", SectionSchema);
