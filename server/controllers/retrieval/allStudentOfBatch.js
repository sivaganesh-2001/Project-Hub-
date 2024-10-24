const Student = require('../../models/student.js');
const Batch = require('../../models/batch');
const Department = require('../../models/department');
const Faculty = require('../../models/faculty'); // Assuming Faculty model for role check

exports.getStudents = async (req, res) => {
  const { deptId, batchCode } = req.body; // Extract from body
  const { facultyId } = req.user; // Assuming `req.user` contains the logged-in user's details

  try {
    // Step 1: Check if the user is authorized
    // const user = await Faculty.findById(facultyId);

    // if (!user || !user.roles.some(role => ['tutor', 'hod', 'projectIncharge'].includes(role))) {
    //   return res.status(403).json({ message: 'Access denied. You are not authorized to view this information.' });
    // }
    
    // If the user is authorized, proceed to fetch students
    if (deptId) {
      const department = await Department.findOne({ deptId });
      if (!department) {
        return res.status(404).json({ message: 'Department not found.' });
      }

      const batches = await Batch.find({ deptId: department._id }).populate('tutorId');
      if (!batches.length) {
        return res.status(404).json({ message: 'No batches found for this department.' });
      }

      const batchIds = batches.map(batch => batch._id);
      const students = await Student.find({ batchCode: { $in: batchIds } }).populate('batchCode');

      return res.status(200).json({
        message: 'Students retrieved successfully for department.',
        students,
        batches,
        department
      });

    } else if (batchCode) {
      const batch = await Batch.findOne({ batchCode }).populate('deptId tutorId');
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found.' });
      }

      const students = await Student.find({ batchCode: batch._id }).populate('batchCode');

      return res.status(200).json({
        message: 'Students retrieved successfully for batch.',
        students,
        batch
      });
    } else {
      return res.status(400).json({ message: 'Invalid request. Please provide either deptId or batchCode.' });
    }
  } catch (error) {
    console.error('Error retrieving students:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
