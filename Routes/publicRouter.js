
const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog');
router.get('/blogs/published', async (req, res) => {
    try {

        const publishedBlogs = await Blog.find({ status: 'published' });

       
        res.json(publishedBlogs);
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
module.exports = router;