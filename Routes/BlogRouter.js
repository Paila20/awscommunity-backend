
// const express = require('express');
// const multer = require('multer');
// const Blog = require('../Models/Blog');
// const User = require('../Models/User'); 
// const ensureAuthenticated = require('../Middlewares/Auth');
// const path = require('path');
// const fs = require('fs');
// const router = express.Router();

// // Multer Setup for Image Upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,  'uploads/'); // Specify the folder to store uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Set the file name as the timestamp + original name
//     },
// });
  
// const upload = multer({
//     storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/; // Allowed image file types
//         const extname = fileTypes.test(file.mimetype); // Validate file extension
//         if (extname) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed.'));
//         }
//     },
// });

// // Route to Create a Blog Post with Image Upload
// router.post('/create', ensureAuthenticated, (req, res, next) => {
//     console.log('Entering /create route');
//     upload.single('image')(req, res, (err) => {
//         if (err) {
//             console.error('Multer error:', err.message);
//             return res.status(400).json({ message: err.message });
//         }
//         console.log('File upload successful:', req.file);
//         next(); // Continue to the next middleware if the file upload is successful
//     });
// }, async (req, res) => {
//     try {
//         console.log('Authenticated user:', req.user); // Log user info
//         const { _id ,name} = req.user;
//         const { title, content } = req.body;
//         console.log('Request body:', req.body);
        
//         // Check if the required fields are present
//         if (!title || !content || !req.file) {
//             console.error('Validation failed: Missing fields');
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Save the image path (using the uploaded file's name)
//         const image = `/uploads/${req.file.filename}`;
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
//             userName:user.name,
//         });
//         console.log('Saving blog:', blog);
//         await blog.save();

//         res.status(201).json({ message: 'Blog created successfully', blog });
//     } catch (error) {
//         console.error('Error in /create route:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });
// // Fetch all blogs (no user filtering)
// router.get('/all', ensureAuthenticated, async (req, res) => {
//     try {
//         // Get all blogs from the database
//         const blogs = await Blog.find();  // No userId filter here
//         res.json(blogs);  // Send the list of blogs as a response
//     } catch (error) {
//         console.error('Error fetching blogs:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// // Route to Get Blogs of Specific User
// router.get('/', ensureAuthenticated, async (req, res) => {
//     const blogs = await Blog.find({ userId: req.user._id });
//     res.json(blogs);
// });

// // Route to Edit a Blog Post
// router.put('/:id', ensureAuthenticated, (req, res, next) => {
//     console.log('Entering /edit route');
//     upload.single('image')(req, res, (err) => {
//         if (err) {
//             console.error('Multer error:', err.message);
//             return res.status(400).json({ message: err.message });
//         }
//         console.log('File upload successful:', req.file);
//         next();
//     });
// }, async (req, res) => {
//     const { title, content } = req.body;
//     let image = req.file ? `/uploads/${req.file.filename}` : undefined;

//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: 'Blog not found.' });

//     if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

//     blog.title = title || blog.title;
//     blog.content = content || blog.content;
//     if (image) blog.image = image;

//     await blog.save();

//     res.json({ message: 'Blog updated successfully', blog });
// });

// // Route to Delete a Blog Post
// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog not found.' });
//         }
//         if (blog.userId.toString() !== req.user._id) {
//             return res.status(403).json({ message: 'Unauthorized.' });
//         }

//         // Delete the associated image from the server
//         const imagePath = path.join(__dirname, '../uploads', blog.image.split('/uploads/')[1]);
//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath); // Delete the image file from the uploads folder
//         }

//         // Use deleteOne to remove the blog
//         await Blog.deleteOne({ _id: req.params.id });

//         res.json({ message: 'Blog deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting blog:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary'); // Cloudinary v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Blog = require('../Models/Blog');
const User = require('../Models/User');
const ensureAuthenticated = require('../Middlewares/Auth');
require('dotenv').config();
const router = express.Router();

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
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
});

// Route to Create a Blog Post with Cloudinary Image Upload
router.post('/create', ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const { _id, name } = req.user;
     {console.log(req.file)}
        if (!title || !content || !req.file) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Cloudinary image URL
        const image = req.file.path;

        // Verify User
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        // Create and save the blog post
        const blog = new Blog({
            title,
            content,
            image,
            date: new Date(),
            userId: _id,
            userName: user.name,
        });

        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/all', ensureAuthenticated, async (req, res) => {
    try {
        // Get all blogs from the database
        const blogs = await Blog.find();  // No userId filter here
        res.json(blogs);  // Send the list of blogs as a response
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/', ensureAuthenticated, async (req, res) => {
    const blogs = await Blog.find({ userId: req.user._id });
    res.json(blogs);
});

// Route to Edit a Blog Post
router.put('/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: 'Blog not found.' });
        if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

        // Update fields
        blog.title = title || blog.title;
        blog.content = content || blog.content;

        if (req.file) {
            blog.image = req.file.path; // Update image path to Cloudinary URL
        }

        await blog.save();
        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Route to Delete a Blog Post
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found.' });

        if (blog.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        // Delete image from Cloudinary
        const publicId = blog.image.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`blogs/${publicId}`);

        // Delete blog from DB
        await Blog.deleteOne({ _id: req.params.id });

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
