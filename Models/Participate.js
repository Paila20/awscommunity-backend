const mongoose = require('mongoose');

const participateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Participate', participateSchema);
