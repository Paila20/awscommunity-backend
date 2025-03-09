const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");
const Event = require("../Models/Event");
require("dotenv").config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "events", allowed_formats: ["jpg", "jpeg", "png", "gif"] },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ✅ Create Event (Admin Only)
router.post("/events", upload.single("image"), async (req, res) => {
  try {
    const { title, category } = req.body;
    // const image = req.file.path; 
    const image = req.file ? req.file.path : null;

    const newEvent = new Event({ title, category, image });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});

// ✅ Fetch All Events (or by category)
router.get("/events", async (req, res) => {
  try {
    const { category } = req.query;
    const events = category ? await Event.find({ category }) : await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// ✅ Fetch Single Event
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
});

// ✅ Update Event (Admin Only)
router.put("/events/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, category } = req.body;
    let updatedData = { title, category };

    if (req.file) {
      updatedData.image = req.file.path; // Cloudinary URL
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
});

// ✅ Delete Event (Admin Only)
router.delete("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Delete from Cloudinary
    const publicId = event.image.split('/').pop().split('.')[0]; // Extract public_id
    await cloudinary.uploader.destroy(`events/events/${publicId}`);

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});

module.exports = router;
