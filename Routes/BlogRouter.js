


// const express = require('express');
// const multer = require('multer');
// const { v2: cloudinary } = require('cloudinary'); // Cloudinary v2
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const Blog = require('../Models/Blog');
// const User = require('../Models/User');
// const ensureAuthenticated = require('../Middlewares/Auth');
// require('dotenv').config();
// const router = express.Router();

// // Cloudinary Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// });

// // Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'blogs', // Cloudinary folder to store images
//         allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file formats
//     },
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
// });

// // Route to Create a Blog Post with Cloudinary Image Upload
// router.post('/create', ensureAuthenticated, upload.single('image'), async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const { _id, name } = req.user;
//      {console.log(req.file)}
//         if (!title || !content || !req.file) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Cloudinary image URL
//         const image = req.file.path;

//         // Verify User
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(400).send({ message: 'User not found' });
//         }

//         // Create and save the blog post
//         const blog = new Blog({
//             title,
//             content,
//             image,
//             date: new Date(),
//             userId: _id,
//             userName: user.name,
//         });

//         await blog.save();

//         res.status(201).json({ message: 'Blog created successfully', blog });
//     } catch (error) {
//         console.error('Error creating blog:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });



// router.get('/', ensureAuthenticated, async (req, res) => {
//     const blogs = await Blog.find({ userId: req.user._id });
//     res.json(blogs);
// });

// // Route to Edit a Blog Post
// router.put('/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const blog = await Blog.findById(req.params.id);

//         if (!blog) return res.status(404).json({ message: 'Blog not found.' });
//         if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

//         // Update fields
//         blog.title = title || blog.title;
//         blog.content = content || blog.content;

//         if (req.file) {
//             blog.image = req.file.path; // Update image path to Cloudinary URL
//         }

//         await blog.save();
//         res.json({ message: 'Blog updated successfully', blog });
//     } catch (error) {
//         console.error('Error updating blog:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// // Route to Delete a Blog Post
// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) return res.status(404).json({ message: 'Blog not found.' });

//         if (blog.userId.toString() !== req.user._id) {
//             return res.status(403).json({ message: 'Unauthorized.' });
//         }

//         // Delete image from Cloudinary
//         const publicId = blog.image.split('/').pop().split('.')[0]; // Extract public ID from URL
//         await cloudinary.uploader.destroy(`blogs/${publicId}`);

//         // Delete blog from DB
//         await Blog.deleteOne({ _id: req.params.id });

//         res.json({ message: 'Blog deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting blog:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// module.exports = router;
 