const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user.js');

// Define /signup and /login endpoints for POST requests
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
