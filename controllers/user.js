// This file contains all user related business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const validator = require('validator');

// Function handles user signup (POST request)
exports.signup = (req, res) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email address' }); // If email address is invalid, return error message, otherwise proceed
    }

    // Calls bcrypt's hash function and asks it to salt the password 10 times
    bcrypt.hash(req.body.password, 10).then((hash) => {
        // The salt value is a random string of characters that is generated for each user and stored in the user's database record along with their hashed password. When the user logs in, their password is combined with the stored salt value, hashed, and then compared to the stored hash value
        // Create new user
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        // Save new user to database
        user.save()
            .then(() => {
                res.status(201).json({
                    message: 'User added successfully!',
                });
            })
            .catch((error) => {
                res.status(500).json({
                    error: error,
                });
            });
    });
};

// Function handles user login (POST request)
exports.login = (req, res) => {
    User.findOne({ email: req.body.email }) // Verify that the email address is in database
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'User not found!' });
            }
            bcrypt
                .compare(req.body.password, user.password) // Compares a string with a hash to check whether an entered password corresponds to a secure hash stored in the database
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: 'Incorrect password !' });
                    }
                    // If user has valid credentials, return 200 response containing User ID and token adding an additional layer of security to the authentication process
                    res.status(200).json({
                        userId: user._id, // Sets the user Id from the database to the userID property
                        token: jwt.sign(
                            // Generates a token with a payload of userID, the signature secret string, and expiry time
                            { userId: user._id }, // Single property object (created with short-hand) set to the same value as the userId property of the response object
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' } // Sets expiry on string to for 24 hours time
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
