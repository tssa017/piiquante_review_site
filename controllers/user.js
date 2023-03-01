// This file contains all user related business logic
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const validator = require('validator');

exports.signup = (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email address' }); // If email address is invalid, return error message, otherwise proceed
    }

    // Calls bcrypt's hash function and asks it to salt the password 10 times
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

exports.login = (req, res, next) => {
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
                            .json({ error: 'Mot de passe incorrect !' });
                    }
                    // If user has valid credentials, return 200 response containing User ID and token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            // Generate a token
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
