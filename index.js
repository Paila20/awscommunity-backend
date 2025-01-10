const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
// const ProductRouter = require('./Routes/ProductRouter');
// const userRoutes = require('./Routes/userRouter');
// const blogRoutes = require('./Routes/BlogRouter');
const adminRoutes = require('./Routes/adminRouter');
const editorRoutes = require('./Routes/editorRouter');
const publicRoutes = require('./Routes/publicRouter');
// const path = require('path');
// const fs = require('fs');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => {
    res.send('PONG');
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

app.use('/auth', AuthRouter);
// app.use('/products', ProductRouter);
// app.use('/users', userRoutes);
app.use('/admin', adminRoutes); 
app.use('/editor', editorRoutes); 
app.use('/public' , publicRoutes)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// app.use('/api/blogs', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})