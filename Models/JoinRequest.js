const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phoneNo: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  city: {
    type: String,
    required: true,
    maxlength: 50,
  },
  interestedIn: {
    type: String,
    enum: ["Volunteer", "Speaker", "Free Consultation", "Other"],
    required: true,
  },
  WorkingAs: {
    type: String,
    enum: ["Student", "IT", "Faculty", "Others"],
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
