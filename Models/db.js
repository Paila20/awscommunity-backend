const mongoose = require('mongoose');
const { createAdmin } = require('../Controllers/AuthController');

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .then(async () => {
        console.log('MongoDB Connected...');
        await createAdmin();
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })