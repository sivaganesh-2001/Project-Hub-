const User = require('../models/User');
const Faculty = require('../models/faculty');
const Department = require('../models/department');
const Batch = require('../models/batch');

exports.updateToIncharge = async (req, res) => {
  const { email, newRole, deptId, batchCode } = req.body;

  try {
    // Validate role
    if (newRole !== 'projectIncharge') {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // Ensure deptId (Department Code) and batchCode are provided
    if (!deptId || !batchCode) {
      return res.status(400).json({ message: 'Department Code and Batch Code are required for Project Incharge.' });
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

    // Find the department by deptId (alphanumeric)
    const department = await Department.findOne({ deptId });
    if (!department) {
      return res.status(400).json({ message: 'Invalid department code.' });
    }

    // Find the batch by batchCode (alphanumeric) and deptId
    const batch = await Batch.findOne({ batchCode, deptId: department._id });
    if (!batch) {
      return res.status(400).json({ message: 'Invalid batch code or batch does not belong to the department.' });
    }

    // Update the role in the Faculty collection
    if (!faculty.roles.includes(newRole)) {
      faculty.roles = [...new Set([...faculty.roles, newRole])];
      faculty.departmentIds = department._id; // Assign the department's ObjectId
      faculty.batchCode = batch._id;          // Assign the batch's ObjectId
      await faculty.save();
    }

    // Update the role in the User collection
    if (!user.roles.includes(newRole)) {
      user.roles = [...new Set([...user.roles, newRole])];
      await user.save();
    }

    // Check if the faculty is already assigned as Project Incharge for this batch
    // if (batch.projectIncharge && batch.projectIncharge.toString() !== faculty._id.toString()) {
    //   return res.status(400).json({ message: 'This batch already has a Project Incharge.' });
    // }

    // Update the projectIncharge field in the Batch collection
    if (!batch.projectIncharge) {
      batch.projectIncharge = faculty._id; // Assign faculty as Project Incharge
      await batch.save();
    }

    res.status(200).json({ message: 'Role updated successfully.', faculty, user, batch });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
