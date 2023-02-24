const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: [String], // Array of userIds
    usersDisliked: [String], // Array of userIds
});

module.exports = mongoose.model('Sauce', sauceSchema); // Exports schema as a Mongoose model so it is available for Express app
