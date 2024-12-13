const express = require('express');
const AuthRouter = require('../Routes/AuthRouter');
const app = express();

app.use(express.json());
app.use('/auth', AuthRouter);

module.exports = app;
