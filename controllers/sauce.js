const fs = require('fs'); // Gives access to functions that allow file system modification
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
    const imageUrl = req.file ? url + '/images/' + req.file.filename : '';

    const sauce = new Sauce({
        // Constructs new Sauce object based on JSON
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: req.body.sauce.likes,
        dislikes: req.body.sauce.dislikes,
        imageUrl: imageUrl,
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
    const sauceId = req.params.id;
    const userId = req.auth.userId;
    const update = req.file
        ? {
              // If a file is uploaded, update imageUrl along with other fields
              ...JSON.parse(req.body.sauce), // ... Allows me to modify specific parts of req.body
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : //  If no file is uploaded, update other fields only
          { ...req.body };
    Sauce.findOneAndUpdate(
        { _id: sauceId, userId },
        { ...update, _id: sauceId },
        { new: true } // Return updated document from response
    )
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: 'Sauce not found.' });
            }
            res.status(200).json({
                message: 'Sauce updated successfully!',
                sauce,
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error.message || 'Failed to update sauce.',
            });
        });
};

// DELETE route deletes an exisiting sauce object based on its ID
exports.deleteSauce = (req, res, next) => {
    // Search for sauce object in database that has the ID specified in params object
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
            // Deletes file from file system
            Sauce.deleteOne({ _id: req.params.id })
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
    });
};

// Liking and disliking of sauces
// POST route allows user to like or dislike a sauce and saves result to database
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        // Checks if a user has liked a sauce
        Sauce.updateOne(
            // This method updates Sauce model in database based on the { _id: req.params.id } filter
            { _id: req.params.id },
            {
                $inc: { likes: 1 }, // MongoDB update operaror increments likes by 1
                $push: { usersLiked: req.body.userId }, // MongoDB update appends userID to the usersLiked array
                _id: req.params.id,
            }
        )
            .then(() => {
                // JSON response indicates that either the sauce has been liked or that an error has occurred
                res.status(201).json({
                    message: 'You liked this sauce!',
                });
            })
            .catch((error) => {
                res.status(400).json({
                    error: error,
                });
            });
    } else if (req.body.like === -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id,
            }
        )
            .then(() => {
                res.status(201).json({
                    message: 'You disliked this sauce!',
                });
            })
            .catch((error) => {
                res.status(400).json({
                    error: error,
                });
            });
    } else {
        // If 'like' field in body request is neither '1' or '-1', this block executes, the user is removing their like or dislike
        Sauce.findOne({ _id: req.params.id }) // Finds Sauce document in database based on ID
            .then((sauce) => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    // Checks usersLiked array for user ID
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 }, // Removes user ID from usersLiked array,
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id,
                        }
                    )
                        .then(() =>
                            res.status(201).json({
                                // JSON response indiciates
                                message:
                                    'You removed your like from this sauce!',
                            })
                        )
                        .catch((error) => res.status(400).json({ error }));
                } else if (
                    sauce.usersDisliked.indexOf(req.body.userId) !== -1
                ) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id,
                        }
                    )
                        .then(() =>
                            res.status(201).json({
                                message: 'You can like this sauce again!',
                            })
                        )
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};
