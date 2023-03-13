const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js'); // Allows authentication of application pages
const multer = require('../middleware/multer-config.js'); // Middleware defines name and destination of image files
const sauceCtrl = require('../controllers/sauce.js');

// Defines sauce endpoints
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getSingleSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
