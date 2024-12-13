const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
// const ExpenseRouter = require('./Routes/ExpenseRouter');
// const ensureAuthenticated = require('./Middlewares/Auth');
const blogRoutes = require('./Routes/BlogRouter');
const path = require('path');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// app.use(express.json({ limit: '10mb' })); 
// app.use(express.urlencoded({ limit: '10mb', extended: true })); 

// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors());

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
// app.use('/expenses', ensureAuthenticated, ExpenseRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api/blogs', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})