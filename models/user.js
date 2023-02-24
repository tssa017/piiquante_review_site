const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // 'Unique' keyword ensures same email cannot be used multiple times
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // This package pre-validates information before saving
module.exports = mongoose.model('User', userSchema); // Exports schema as a Mongoose model for Express app
