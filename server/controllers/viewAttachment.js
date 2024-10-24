const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/User');

exports.viewAttachment = async (req, res) => {
  const token = req.query.token; // Extract the token from the query parameter
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // If the token is valid, proceed to send the file
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/', filename); // Adjust path if needed

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).json({ message: 'File not found' });
      }
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
