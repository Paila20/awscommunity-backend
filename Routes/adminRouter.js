

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const Blog = require('../Models/Blog');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { ensureAuthenticated, isAdmin } = require('../Middlewares/Auth');


// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogs', // Cloudinary folder to store images
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 2 MB file size limit
});




// 1. Admin: Create a User
router.post('/users', ensureAuthenticated,isAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['Admin', 'Editor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password : hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully.', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 2. Admin: Delete a User
router.delete('/users/:id', ensureAuthenticated,isAdmin,async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 3. Admin: Fetch List of Users
router.get('/users', ensureAuthenticated,isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'Editor' });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/blogs/draft', ensureAuthenticated, isAdmin, async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Forbidden: Only Admin can access this route.' });
        }

       
        const draftBlogs = await Blog.find({
            status: 'draft',
            userId: req.user._id, 
        });

        res.json(draftBlogs);
     
       
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 5. Admin: Create a Blog with Cloudinary Upload
router.post('/blogs', ensureAuthenticated,isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content} = req.body;
        

       const{_id} = req.user;
       console.log(_id)
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        const blog = new Blog({
            title,
            content,
            image:req.file.path, 
            userId: _id,
            userName: user.name,
        });

        await blog.save();
        res.status(201).json({ message: 'Blog created successfully.', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 6. Admin: Update a Blog with Cloudinary Upload
router.put('/blogs/:id', ensureAuthenticated,isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        if (req.file) {
            blog.image = req.file.path; // Update Cloudinary URL
        }

        await blog.save();
        res.json({ message: 'Blog updated successfully.', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 7. Admin: Delete a Blog
router.delete('/blogs/:id', ensureAuthenticated,isAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        await blog.deleteOne();
        res.json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 8. Admin: Update Blog Status
router.patch('/blogs/:id/status',ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        blog.status = status;
        await blog.save();

        res.json({ message: `Blog status updated to ${status}.`, blog });
    } catch (error) {
        console.error('Error updating blog status:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


module.exports = router;
