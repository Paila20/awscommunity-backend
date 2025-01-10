const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = express.Router();

// Middleware to check Admin role
const ensureAdmin = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    next();
};

// Get All Users
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const users = await User.find(); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create User
router.post('/create', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete User
router.delete('/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
