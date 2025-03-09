const express = require('express');
const router = express.Router();
const Participate = require('../Models/Participate'); 
const { ensureAuthenticated, isAdmin } = require('../Middlewares/Auth');


// Create Learning Page Content (Admin Only)
router.post('/participate',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const participate = new Participate({ title, description });
    await participate.save();
    res.status(201).json({ message: "Participate content created", participate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Read Learning Page Content (Public)
router.get('/participate', async (req, res) => {
  try {
    const participate = await Participate.find();
    res.status(200).json(participate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Learning Page Content (Admin Only)
router.put('/participate/:id',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedParticipate = await Participate.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    res.status(200).json({ message: "Expect Content updated", updatedParticipate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Learning Page Content (Admin Only)
router.delete('/participate/:id',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    await Participate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Participate content deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
