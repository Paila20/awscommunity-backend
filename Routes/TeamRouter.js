const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
const Team = require("../Models/Team");
const { ensureAuthenticated, isAdmin } = require("../Middlewares/Auth");
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer Storage Setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "team", // Cloudinary folder to store images
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});



router.post("/team", ensureAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, designation, role } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !designation || !role || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMember = new Team({ name, designation, role, image });
    await newMember.save();

    res.status(201).json({ message: "Team member added successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get All Team Members (Public)
router.get("/team", async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.get("/team/:id", async (req, res) => {
//   try {
//     const member = await Team.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ message: "Team member not found" });
//     }
//     res.status(200).json(member);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update Team Member (Admin Only)
router.put("/team/:id", ensureAuthenticated, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, designation, role } = req.body;
    let updateData = { name, designation, role };

    if (req.file) {
      updateData.image = req.file.path; // Update image if a new file is uploaded
    }

    const updatedMember = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Team member updated successfully", member: updatedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Delete Team Member (Admin Only)
router.delete("/team/:id", ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const deletedMember = await Team.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
