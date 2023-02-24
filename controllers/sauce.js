const Sauce = require('../models/sauce.js');

// Creation and modification of sauces
// GET route that gets an array of all sauces from database
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// POST route that creates a new sauce and saves to database
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce); // Parses response object to JSON
    const url = req.protocol + '://' + req.get('host'); // To use in image file path
    const sauce = new Sauce({
        // Constructs new Sauce object based on JSON
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: req.body.sauce.usersLiked,
        usersDisliked: req.body.sauce.usersDisliked,
        userId: req.body.sauce.userId,
    });
    sauce
        .save() // Saves Sauce object to database
        .then(() => {
            res.status(201).json({
                message: 'Post saved successfully!',
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// GET route for single sauce based on its id
exports.getSingleSauce = (req, res, next) => {
    Sauce.findOne({
        // Searches for single Sauce document in databse whose _id matches the id parameter in the request URL
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

// PUT route modifies an existing sauce object based on its ID
exports.modifySauce = (req, res, next) => {
    // Creates new instance of Sauce model using id parameter from request which will be updated in database
    let sauce = new Sauce({ _id: req.params._id });
    // Check if there is a file attached to request
    if (req.file) {
        const url = req.protocol + '://' + req.get('host'); // To use in image file path
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            likes: req.body.sauce.likes,
            dislikes: req.body.sauce.dislikes,
            imageUrl: url + '/images/' + req.file.fileName,
            mainPepper: req.body.sauce.mainPepper,
            usersLiked: req.body.sauce.usersLiked,
            usersDisliked: req.body.sauce.usersDisliked,
            userId: req.body.sauce.userId,
        };
    } else {
        sauce = {
            // Sets properties of sauce object to values in the request body
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            imageUrl: req.body.imageUrl, // If no file is attached, imageUrl is set to the value in the request body
            mainPepper: req.body.mainPepper,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked,
            userId: req.body.userId,
        };
    }
    sauce
        .updateOne({ _id: req.params.id }, sauce) // Updates Sauce corresponding to ID
        .then(() => {
            res.status(201).json({
                message: 'Thing updated successfully!',
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

// DELETE route deletes an exisiting sauce object based on its ID
exports.deleteSauce = (req, res, next) => {
    // Search for sauce object in database that has the ID specified in params object
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (!sauce) {
            return res.status(404).json({
                error: new Error('No such sauce!'),
            });
        }
        if (sauce.userId !== req.auth.userId) {
            // Ensures that a user is authorised to delete a sauce (only an owner can delete) by comparing userID
            return res.status(400).json({
                error: new Error('Unauthorised request!'),
            });
        }
        Sauce.deleteOne({ _id: req.params.id }) // Deletes Sauce corresponding to ID
            .then(() => {
                res.status(200).json({
                    message: 'Deleted!',
                });
            })
            .catch((error) => {
                res.status(400).json({
                    error: error,
                });
            });
    });
};

// Liking and disliking of sauces
