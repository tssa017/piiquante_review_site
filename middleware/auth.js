const jwt = require('jsonwebtoken'); // Imports jsonwebtoken library into file

// Checks if a user is authorised to login to Piiquante site
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Retrieves token from the Auhtorization header in request
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Compare user ID from token with user ID from request body
        const userId = decodedToken.userId;
        req.auth = { userId }; // Assigns an object with single userId property to the auth property of the request object
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next(); // Passes control to next middleware function in stack
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
        });
    }
};
