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

    // Call hash function and set salt value to 10
    bcrypt.hash(req.body.password, 10).then((hash) => {
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
    User.findOne({ email: req.body.email }) // Verify email address exists in database
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'User not found!' });
            }
            bcrypt
                .compare(req.body.password, user.password) // Compares string with hash to check whether an entered password corresponds to a secure hash stored in the database
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: 'Incorrect password !' });
                    }
                    res.status(200).json({
                        userId: user._id, // Sets the userId from the database to the userID property
                        token: jwt.sign(
                            // Generates token that contains userID, the signature secret string, and expiry time
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' } // Sets expiry on string to for 24 hours time
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
