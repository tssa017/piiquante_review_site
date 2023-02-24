const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/user.js'); // Imports user route
const sauceRoutes = require('./routes/sauce.js'); // Imports sauce route

const app = express();

app.use(express.json()); // Makes the body of any incoming request with Content-Type application/json available in the req object

// Connecting to database
mongoose
    .connect(
        'mongodb+srv://' +
            process.env.MONGODBUSER +
            ':' +
            process.env.MONGODBKEY +
            '@cluster0.zlcanyx.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

// Sets access control headers to allow cross-origin sharing
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // This middleware sets the images folder where the file will be uploaded as static

app.use('/api/auth', userRoutes); // Registers user route
app.use('/api/sauces', sauceRoutes); // Registers sauces route

module.exports = app; // Exports app object for use in other modules
