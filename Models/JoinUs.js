const mongoose = require("mongoose");

const joinUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phoneNo: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    interestedIn: {
      type: String,
      required: true,
      enum: ["Volunteer", "Speaker", "Free Consultation", "Other"], // Dropdown Options
    },
    WorkingAs: {
        type: String,
        required: true,
        enum: ["Student", "IT", "Faculty", "Others"], // Dropdown Options
      },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const JoinUs = mongoose.model("JoinUs", joinUsSchema);

module.exports = JoinUs;
