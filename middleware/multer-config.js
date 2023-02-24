const multer = require('multer'); // Imports multer package for handling file uploads

// Map MIME types to file extensions used in the filename function
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// Specifies how uploaded file should be stored
const storage = multer.diskStorage({
    // Specifies the directory where the file should be stored
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Generates unique file name for uploaded file
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Prevents naming errors by removing any whitespace and replacing with underscore
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});

// multer middleware configured to handle a single image file
module.exports = multer({ storage: storage }).single('image');
