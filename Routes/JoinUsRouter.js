const express = require("express");
const router = express.Router();
const JoinUs = require("../Models/JoinUs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { ensureAuthenticated, isAdmin } = require("../Middlewares/Auth");

// 📌 Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

// 📌 1️⃣ API - Submit Join Us Form (Anyone can fill)
router.post("/join-us", async (req, res) => {
  try {
    const { name, email, phoneNo, city, interestedIn, WorkingAs, message } = req.body;

    if (!name || !email || !phoneNo || !city || !interestedIn || !WorkingAs || !message) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Check if the email is already registered
    const existingUser = await JoinUs.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists." });
    }

    // Save form entry in the database
    const newEntry = new JoinUs({ name, email, phoneNo, city, interestedIn, WorkingAs, message });
    await newEntry.save();

    // 📩 Send Email to Admin
    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Join Us Form Submission",
      html: `
        <h2>New Join Us Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNo}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Interested In:</strong> ${interestedIn}</p>
        <p><strong>Working As:</strong> ${WorkingAs}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // 📩 Send Confirmation Email to User
    const userMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Thank You for Joining Us!",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for showing interest in joining us! Our team will review your request and get back to you soon.</p>
        <p><strong>Your Details:</strong></p>
        <p><strong>Interested In:</strong> ${interestedIn}</p>
        <p><strong>Working As:</strong> ${WorkingAs}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Best Regards,<br>Cloud Community Bharat Team</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(201).json({ msg: "Form submitted successfully and emails sent!" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
});

// 📌 2️⃣ API - Get All Join Us Form Entries (Admin Only)
router.get("/join-us/all", ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const entries = await JoinUs.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
});

// 📌 3️⃣ API - Delete a Join Us Form Entry by ID (Admin Only)
router.delete("/join-us/:id", ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const entry = await JoinUs.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ msg: "Entry not found" });
    }

    await JoinUs.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
});

module.exports = router;
