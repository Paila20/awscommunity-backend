const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
const Page = require("../Models/Page");
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
  cloudinary,
  params: {
    folder: "pages", // Cloudinary folder to store images
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});


// Create Page Data with Images
router.post("/home", upload.fields([{ name: "logo" }, { name: "banner" }]), async (req, res) => {
    const { description } = req.body;
  
    if (!req.files || !req.files["logo"] || !req.files["banner"] || !description) {
      return res.status(400).json({ message: "All fields (logo, banner, description) are required" });
    }
  
    try {
      const newPage = new Page({
        logo: req.files["logo"][0].path,
        banner: req.files["banner"][0].path,
        description,
      });
  
      await newPage.save();
      res.status(201).json(newPage);
    } catch (error) {
      res.status(500).json({ error: "Failed to create page data" });
    }
  });

  // Fetch Page Data
router.get("/home", async (req, res) => {
    try {
      const page = await Page.findOne();
      if (!page) return res.status(404).json({ message: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page data" });
    }
  });

  // Update Page Data (with optional new images)
router.put("/home/:id", ensureAuthenticated, isAdmin, upload.fields([{ name: "logo" }, { name: "banner" }]), async (req, res) => {
    const { description } = req.body;
  
    try {
      const updatedData = { description };
  
      if (req.files?.logo) updatedData.logo = req.files["logo"][0].path;
      if (req.files?.banner) updatedData.banner = req.files["banner"][0].path;
  
      const updatedPage = await Page.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!updatedPage) return res.status(404).json({ message: "Page not found" });
  
      res.json(updatedPage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page data" });
    }
  });
  
  module.exports = router;