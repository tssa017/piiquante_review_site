const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Retrieves token from the Auhtorization header in the request
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Returns decoded token
        const userId = decodedToken.userId;
        req.auth = { userId }; // Compares user ID from token with user ID from Sauce
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!'),
        });
    }
};
