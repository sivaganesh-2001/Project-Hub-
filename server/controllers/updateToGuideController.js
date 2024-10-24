const User = require('../models/User');
const Faculty = require('../models/faculty');
const Batch = require('../models/batch'); // Assuming you have a Batch model

exports.updateToGuide = async (req, res) => {
  const { email, newRole, batchCode } = req.body;

  try {
    // Validate role
    if (newRole !== 'projectGuide') {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // Find the batch by its alphanumeric code
    const batch = await Batch.findOne({ batchCode: batchCode }); // Assuming 'code' is the field for the alphanumeric batch code
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Find the faculty member by email
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Ensure faculty roles and batchCode are arrays (initialize if necessary)
    faculty.roles = Array.isArray(faculty.roles) ? faculty.roles : [];
    faculty.batchCode = faculty.batchCode || [];

    // Check if faculty is already a guide, if not append the role
    if (!faculty.roles.includes(newRole)) {
      faculty.roles.push(newRole);
    }

    // Check if the batchCode is already present, if not append the new batchCode ObjectId
    if (!faculty.batchCode.includes(batch._id)) {
      faculty.batchCode = batch._id; // If batchCode is not an array
    }

    await faculty.save();

    // Ensure user roles is an array (initialize if necessary)
    user.roles = Array.isArray(user.roles) ? user.roles : [];

    // Update the role in the User collection if not already present
    if (!user.roles.includes(newRole)) {
      user.roles.push(newRole);
      await user.save();
    }

    res.status(200).json({ message: 'Role and batchCode updated successfully.', faculty, user });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
