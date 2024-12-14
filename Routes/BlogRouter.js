


// const express = require('express');
// const multer = require('multer');
// const sharp = require('sharp');
// const fs = require('fs');
// const Blog = require('../Models/Blog');
// const ensureAuthenticated = require('../Middlewares/Auth');
// const router = express.Router();

// // Multer Setup for Image Upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// });
  
// const upload = multer({
//     storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/; // Allowed extensions
//         const extname = fileTypes.test(file.mimetype);
//         if (extname) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed.'));
//         }
//     },
// });

// // Middleware for image upload and compression
// const handleImageUpload = (req, res, next) => {
//     upload.single('image')(req, res, async (err) => {
//         if (err) {
//             console.error('Multer error:', err.message);
//             return res.status(400).json({ message: err.message });
//         }
//         console.log('File upload successful:', req.file);

//         // Compress the uploaded image using Sharp
//         if (req.file) {
//             try {
//                 const compressedImagePath = `uploads/compressed-${req.file.filename}`;
//                 await sharp(req.file.path)
//                     .resize(800) // Resize image (you can adjust the size as needed)
//                     .toFormat('jpeg')
//                     .jpeg({ quality: 80 }) // Compress image to 80% quality
//                     .toFile(compressedImagePath);

//                 // Delete the original uncompressed file after compression
//                 fs.unlinkSync(req.file.path);

//                 // Set the compressed image path
//                 req.file.compressedPath = `/uploads/compressed-${req.file.filename}`;
//             } catch (error) {
//                 console.error('Error compressing image:', error.message);
//                 return res.status(500).json({ message: 'Image compression failed.' });
//             }
//         }
//         next();
//     });
// };

// // Create Blog
// router.post('/create', ensureAuthenticated, handleImageUpload, async (req, res) => {
//     try {
//         console.log('Authenticated user:', req.user); // Log user info
//         const { _id } = req.user;
//         const { title, content } = req.body;
//         console.log('Request body:', req.body);
//         let image = req.file ? req.file.compressedPath : null;

//         if (!title || !content || !image) {
//             console.error('Validation failed: Missing fields');
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const blog = new Blog({
//             title,
//             content,
//             image,
//             date: new Date(),
//             userId: _id,
//         });
//         console.log('Saving blog:', blog);
//         await blog.save();
//         res.status(201).json({ message: 'Blog created successfully', blog });
//     } catch (error) {
//         console.error('Error in /create route:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// // Edit Blog
// router.put('/:id', ensureAuthenticated, handleImageUpload, async (req, res) => {
//     const { title, content } = req.body;
//     let image = req.file ? req.file.compressedPath : undefined;

//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) return res.status(404).json({ message: 'Blog not found.' });
//         if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

//         blog.title = title || blog.title;
//         blog.content = content || blog.content;
//         if (image) blog.image = image;

//         await blog.save();

//         res.json({ message: 'Blog updated successfully', blog });
//     } catch (error) {
//         console.error('Error updating blog:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// // Delete Blog
// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog not found.' });
//         }
//         if (blog.userId.toString() !== req.user._id) {
//             return res.status(403).json({ message: 'Unauthorized.' });
//         }

//         // Delete the associated image if it exists
//         if (blog.image) {
//             const imagePath = `uploads${blog.image}`;
//             try {
//                 fs.unlinkSync(imagePath);
//                 console.log('Image deleted successfully:', imagePath);
//             } catch (error) {
//                 console.error('Error deleting image:', error.message);
//             }
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
const Blog = require('../Models/Blog');
const User = require('../Models/User'); 
const ensureAuthenticated = require('../Middlewares/Auth');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set the file name as the timestamp + original name
    },
});
  
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed image file types
        const extname = fileTypes.test(file.mimetype); // Validate file extension
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

// Route to Create a Blog Post with Image Upload
router.post('/create', ensureAuthenticated, (req, res, next) => {
    console.log('Entering /create route');
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err.message);
            return res.status(400).json({ message: err.message });
        }
        console.log('File upload successful:', req.file);
        next(); // Continue to the next middleware if the file upload is successful
    });
}, async (req, res) => {
    try {
        console.log('Authenticated user:', req.user); // Log user info
        const { _id ,name} = req.user;
        const { title, content } = req.body;
        console.log('Request body:', req.body);
        
        // Check if the required fields are present
        if (!title || !content || !req.file) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Save the image path (using the uploaded file's name)
        const image = `/uploads/${req.file.filename}`;
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
            userName:user.name,
        });
        console.log('Saving blog:', blog);
        await blog.save();

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
// Fetch all blogs (no user filtering)
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

// Route to Get Blogs of Specific User
router.get('/', ensureAuthenticated, async (req, res) => {
    const blogs = await Blog.find({ userId: req.user._id });
    res.json(blogs);
});

// Route to Edit a Blog Post
router.put('/:id', ensureAuthenticated, (req, res, next) => {
    console.log('Entering /edit route');
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err.message);
            return res.status(400).json({ message: err.message });
        }
        console.log('File upload successful:', req.file);
        next();
    });
}, async (req, res) => {
    const { title, content } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });

    if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    if (image) blog.image = image;

    await blog.save();

    res.json({ message: 'Blog updated successfully', blog });
});

// Route to Delete a Blog Post
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        if (blog.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        // Delete the associated image from the server
        const imagePath = path.join(__dirname, '../uploads', blog.image.split('/uploads/')[1]);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file from the uploads folder
        }

        // Use deleteOne to remove the blog
        await Blog.deleteOne({ _id: req.params.id });

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
