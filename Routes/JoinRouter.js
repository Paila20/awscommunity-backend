const express = require("express");
const router = express.Router();
const JoinRequest = require("../Models/JoinRequest");
const { sendConfirmationEmail } = require("../utils/mailer");
// const { ensureAuthenticated, isAdmin } = require("../middleware/auth"); 

// POST /api/join-us
router.post("/join-us", async (req, res) => {
  try {
    const newRequest = new JoinRequest(req.body);
    await newRequest.save();

    // Send email
    await sendConfirmationEmail(req.body.email, req.body.name);

    res.status(201).json({ message: "Form submitted and confirmation email sent!" });
  } catch (err) {
    console.error("Error in form submission:", err);
    res.status(500).json({ message: "Failed to submit form" });
  }
});

// GET /api/join-us/all (Admin only)
router.get("/join-us/all", async (req, res) => {
  try {
    const entries = await JoinRequest.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
});

// DELETE /api/join-us/:id (Admin only)
router.delete("/join-us/:id",  async (req, res) => {
  try {
    await JoinRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
});

module.exports = router;
