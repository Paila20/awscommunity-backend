const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    status: {
        type: String,
        enum: ['draft', 'pending', 'published', 'rejected'],
        default: 'draft',
    },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true } 
});

module.exports = mongoose.model('Blog', blogSchema);
