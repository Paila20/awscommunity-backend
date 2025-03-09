const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
