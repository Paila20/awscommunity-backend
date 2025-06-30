const express = require("express");
const router = express.Router();
const Section = require("../Models/Section");
const { ensureAuthenticated, isAdmin } = require("../Middlewares/Auth");
// Create Section
router.post("/sections", async (req, res) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Sections
router.get("/sections", async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Section by Menu
// router.get("/sections/:menu", async (req, res) => {
//   try {
//     const section = await Section.findOne({ sectionMenu: req.params.menu });
//     if (!section) return res.status(404).json({ error: "Section not found" });
//     res.json(section);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Get Section by ID or Menu
router.get("/sections/:param",  async (req, res) => {
    try {
      let section;
      // Check if the param is a valid MongoDB ObjectId
      if (req.params.param.match(/^[0-9a-fA-F]{24}$/)) {
        section = await Section.findById(req.params.param);
      } else {
        section = await Section.findOne({ sectionMenu: req.params.param });
      }
  
      if (!section) return res.status(404).json({ error: "Section not found" });
      res.json(section);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Update Section
router.put("/sections/:id",  async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json(section);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Section
router.delete("/sections/:id", async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
