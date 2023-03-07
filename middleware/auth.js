const jwt = require('jsonwebtoken'); // Imports jsonwebtoken library into file

// Middleware function checks if a user is authorised to login to Piiquante site
module.exports = (req, res, next) => {
    // Express app function has access to HTTP request (including headers), response object (used to send HTTP response back to client), and next() function used to pass controle on to next middleware function in stack
    try {
        // Try-catch blocks are frequently used for error handling in JavaScript (the `try` block contains the code that may contain an error)
        const token = req.headers.authorization.split(' ')[1]; // Retrieves token from the Auhtorization header in the request by separating the authorization header into type (bearer) and token (separated with an empty space), and grabs the token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // jwt.verify() method takes two parameters: the JWT to be verified and the secret key used to sign the JWT. Returns decoded token if the JWT is valid and has been signed with the correct secret key
        // Compare user ID from token with user ID from request body
        const userId = decodedToken.userId;
        req.auth = { userId }; // Assigns an object with single userId property to the auth property of the req (request) object so to compare
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'; // If no match, throw error
        } else {
            next(); // Passes control to next middleware function in stack
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
        });
    }
};
