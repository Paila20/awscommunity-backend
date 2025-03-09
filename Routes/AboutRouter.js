const express = require('express');
const router = express.Router();
const About = require('../Models/About'); 
const { ensureAuthenticated, isAdmin } = require('../Middlewares/Auth');

//  Create About Page Content (Admin Only)
router.post('/about',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const about = new About({ title, description });
    await about.save();
    res.status(201).json({ message: "About Page content created", about });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read About Page Content (Public)
router.get('/about', async (req, res) => {
  try {
    const about = await About.find();
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Update About Page Content (Admin Only)
router.put('/about/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedAbout = await About.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    res.status(200).json({ message: "About Page updated", updatedAbout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete About Page Content (Admin Only)
router.delete('/about/:id', ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "About Page content deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
