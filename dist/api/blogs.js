const express = require('express');
const BlogRouter = require('../Routes/BlogRouter');
const app = express();
app.use(express.json());
app.use('/api/blogs', BlogRouter);
module.exports = app;