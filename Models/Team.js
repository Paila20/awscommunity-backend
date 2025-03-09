const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  image: { type: String, required: true }, // Store image URL
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
