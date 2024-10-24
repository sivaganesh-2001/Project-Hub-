const mongoose = require('mongoose');
const Faculty = require('../models/faculty');

exports.getRoles = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using middleware to set req.user with the correct userId
    console.log('User ID:', userId); // Debug log to check if userId is correct

    // Use findOne to search for faculty by userId
    const faculty = await Faculty.findOne({ userId }).select('roles'); // Find faculty by userId and fetch only roles

    if (!faculty) {
      console.log('Faculty not found'); // Log for debugging
      return res.status(404).json({ message: 'Faculty not found' });
    }

    console.log('Roles retrieved:', faculty.roles); // Log the roles retrieved for debugging
    return res.json({ roles: faculty.roles });
  } catch (error) {
    console.error('Error fetching roles:', error); // Log error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};
