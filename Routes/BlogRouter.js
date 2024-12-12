
const express = require('express');
const Blog = require('../Models/Blog');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = express.Router();

// Get All Blogs (Public route)
router.get('/all', async (req, res) => {
    try {
        const blogs = await Blog.find(); // Find all blogs in the database
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching all blogs:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get Blogs of Specific User (Authenticated route)
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.user._id }); // Find blogs by the authenticated user's ID
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching user blogs:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create Blog
router.post('/create', ensureAuthenticated, async (req, res) => {
    try {
        console.log('Authenticated user:', req.user); // Log user info
        const { _id } = req.user;
        const { title, content, image } = req.body; // Expect image as a URL

        console.log('Request body:', req.body);
        if (!title || !content || !image) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const blog = new Blog({
            title,
            content,
            image,  // This will be the URL of the uploaded image
            date: new Date(),
            userId: _id,
        });

        console.log('Saving blog:', blog);
        await blog.save();
        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Edit Blog
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { title, content, image } = req.body; // Expect image as a URL

        const blog = await Blog.findByIdAndUpdate(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found.' });

        if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.image = image || blog.image; // Use the URL passed from frontend

        await blog.save();

        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error in /edit route:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete Blog
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        if (blog.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        await Blog.deleteOne({ _id: req.params.id });

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
