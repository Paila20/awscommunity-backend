

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const { v2: cloudinary } = require('cloudinary');
const Blog = require('../Models/Blog');
const User = require('../Models/User');
require('dotenv').config();
const { ensureAuthenticated, isEditor ,isAdmin} = require('../Middlewares/Auth');


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





router.get('/blogs/myblogs',ensureAuthenticated, async (req, res) => {
    try {
        const blogs = await Blog.find({userId:req.user._id});
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// 5. Admin: Create a Blog with Cloudinary Upload
router.post('/blogs', ensureAuthenticated,isEditor,upload.single('image'), async (req, res) => {
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
router.put('/blogs/:id', ensureAuthenticated,isEditor, upload.single('image'), async (req, res) => {
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
router.delete('/blogs/:id', ensureAuthenticated,isEditor, async (req, res) => {
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



router.patch('/blogs/:id/send-for-approval', ensureAuthenticated, isEditor, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        // Ensure only the author can send their blog for approval
        if (blog.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only update your own blogs.' });
        }
        console.log('Blog User ID:', blog.userId.toString());
        console.log('Request User ID:', req.user._id.toString());
        
        if (blog.status !== 'draft') {
            return res.status(400).json({ message: 'Only draft blogs can be sent for approval.' });
        }

        blog.status = 'pending';
        await blog.save();

        res.json({ message: 'Blog sent for approval.', blog });
    } catch (error) {
        console.error('Error sending blog for approval:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
router.get('/blogs/draft', ensureAuthenticated, isEditor, async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'Editor') {
            return res.status(403).json({ message: 'Forbidden: Only editors can access this route.' });
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

router.get('/blogs/pending', ensureAuthenticated, isEditor, async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'Editor') {
            return res.status(403).json({ message: 'Forbidden: Only editors can access this route.' });
        }

       
        const pendingBlogs = await Blog.find({
            status: 'pending',
            userId: req.user._id, 
        });

        res.json(pendingBlogs);
     
       
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/blogs/rejected', ensureAuthenticated, isEditor, async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'Editor') {
            return res.status(403).json({ message: 'Forbidden: Only editors can access this route.' });
        }

       
        const rejectedBlogs = await Blog.find({
            status: 'rejected',
            userId: req.user._id, 
        });

        res.json(rejectedBlogs);
     
       
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.patch('/blogs/:id/status', ensureAuthenticated, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['published', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Only "published" or "rejected" allowed.' });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        // Ensure the blog is in "pending" before approving or rejecting
        if (blog.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending blogs can be approved or rejected.' });
        }

        blog.status = status;
        await blog.save();

        res.json({ message: `Blog status updated to ${status}.`, blog });
    } catch (error) {
        console.error('Error updating blog status:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// router.patch('/blogs/:id/status', ensureAuthenticated, async (req, res) => {
//     try {
//         const { status } = req.body;

//         // Allow only "pending" status when sending for approval
//         if (status !== 'pending') {
//             return res.status(400).json({ message: 'Invalid status. Only "pending" allowed when sending for approval.' });
//         }

//         const blog = await Blog.findById(req.params.id);

//         if (!blog) {
//             return res.status(404).json({ message: 'Blog not found.' });
//         }

//         // Ensure the blog is not already in "pending" or "published" status
//         if (['pending', 'published'].includes(blog.status)) {
//             return res.status(400).json({ message: 'Blog is already in pending or published status.' });
//         }

//         // Update the blog's status to "pending"
//         blog.status = status;
//         await blog.save();

//         res.json({ message: 'Blog status updated to pending for approval.', blog });
//     } catch (error) {
//         console.error('Error updating blog status:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });


router.get('/blogs', ensureAuthenticated, async (req, res) => {
    try {
        // Find all users with the role of 'editor'
        const editors = await User.find({ role: 'Editor' }).select('_id');
        const editorIds = editors.map(editor => editor._id);

        // Fetch all blogs created by editors
        const blogs = await Blog.find({ userId: { $in: editorIds } });

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.get('/blogs/allpending', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        // Find all users with the role of 'Editor'
        const editors = await User.find({ role: 'Editor' }).select('_id');
        const editorIds = editors.map(editor => editor._id);

        // Fetch all blogs created by editors with status 'pending'
        const blogs = await Blog.find({ 
            userId: { $in: editorIds },
            status: 'pending' // Add this condition to filter by status
        });

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



module.exports = router;
