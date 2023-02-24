const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js'); // Middleware that allows authentification of application pages
const multer = require('../middleware/multer-config.js'); // Middleware that defines the name and destination of image files
const sauceCtrl = require('../controllers/sauce.js');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
// Colon before id signifies that the ID will be a dynamic parameter
router.get('/:id', auth, sauceCtrl.getSingleSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
