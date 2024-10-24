const multer = require('multer');
const path = require('path');

// Configure storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
