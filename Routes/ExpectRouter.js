const express = require('express');
const router = express.Router();
const Expect = require('../Models/Expect'); 
const { ensureAuthenticated, isAdmin } = require('../Middlewares/Auth');


// Create Learning Page Content (Admin Only)
router.post('/expect',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const expect = new Expect({ title, description });
    await expect.save();
    res.status(201).json({ message: "Expect content created", expect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Read Learning Page Content (Public)
router.get('/expect', async (req, res) => {
  try {
    const expect = await Expect.find();
    res.status(200).json(expect);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Learning Page Content (Admin Only)
router.put('/expect/:id',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedExpect = await Expect.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    res.status(200).json({ message: "Expect Content updated", updatedExpect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Learning Page Content (Admin Only)
router.delete('/expect/:id',  ensureAuthenticated, isAdmin, async (req, res) => {
  try {
    await Expect.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expect content deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
