const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Try-catch blocks frequently used for error handling in JavaScript (try block contians the code that may contian an error)
        const token = req.headers.authorization.split(' ')[1]; // Retrieves token from the Auhtorization header in the request by separating the authorization header into type (bearer) and token, and grabs the token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Returns decoded token by verifying user's identity
        const userId = decodedToken.userId;
        req.auth = { userId }; // Compares user ID from token with user ID from Sauce
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
