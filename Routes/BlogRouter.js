const express = require('express');
const multer = require('multer');
const Blog = require('../Models/Blog');
// const authenticate = require('../middleware/authenticate');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = express.Router();

// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
  
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed extensions
        const extname = fileTypes.test(file.mimetype);
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

router.post('/create', ensureAuthenticated, (req, res, next) => {
    console.log('Entering /create route');
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err.message);
            return res.status(400).json({ message: err.message });
        }
        console.log('File upload successful:', req.file);
        next();
    });
}, async (req, res) => {
    try {
        console.log('Authenticated user:', req.user); // Log user info
        const { _id } = req.user;
        const { title, content } = req.body;
        console.log('Request body:', req.body);
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !image) {
            console.error('Validation failed: Missing fields');
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const blog = new Blog({
            title,
            content,
            image,
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



// router.post('/create', ensureAuthenticated, (req, res, next) => {
//     upload.single('image')(req, res, (err) => {
//         if (err) {
//             console.error('Multer error:', err.message);
//             return res.status(400).json({ message: err.message });
//         }
//         next();
//     });
// }, async (req, res) => {
//     const{_id} =req.user;
//     console.log(_id)
//     const { title, content } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null;
    
//     if (!title || !content || !image) return res.status(400).json({ message: 'All fields are required.' });

//     const blog = new Blog({ title, content, image, date: new Date(), userId: _id });
//     console.log(blog)
//     await blog.save();
//     res.status(201).json({ message: 'Blog created successfully', blog });
// });

// Get Blogs of Specific User
router.get('/', ensureAuthenticated, async (req, res) => {
    const blogs = await Blog.find({ userId: req.user._id });
    res.json(blogs);
});

// Edit Blog
router.put('/:id', ensureAuthenticated, (req, res, next) => {
    console.log('Entering /create route');
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
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const blog = await Blog.findByIdAndUpdate(req.params.id,
                                           {title,content,image},
                                           {new:true}
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });
    if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    if (image) blog.image = image;
    await blog.save();

    res.json({ message: 'Blog updated successfully', blog });
});


// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: 'Blog not found.' });
//     if (blog.userId.toString() !== req.user._id) return res.status(403).json({ message: 'Unauthorized.' });

//     await blog.remove();
//     res.json({ message: 'Blog deleted successfully' });
// });
// module.exports = router;

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        if (blog.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized.' });
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
