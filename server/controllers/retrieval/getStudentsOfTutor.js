const Student = require('../../models/student.js');
const Batch = require('../../models/batch');
const Faculty = require('../../models/faculty'); // Assuming Faculty model for user roles

exports.getStudentsOfTutor = async (req, res) => {
  const userId = req.user._id; // Correctly extract the userId from req.user (this is the ObjectId from the User model)

  try {
    // Step 1: Find the faculty using the userId
    const faculty = await Faculty.findOne({ userId }).populate('batchCode');

    if (!faculty || !faculty.roles.some(role => ['tutor', 'projectIncharge', 'hod'].includes(role))) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to view this information.' });
    }

    // Step 2: Retrieve the batchCode(s) from the faculty details
    const batchCodes = faculty.batchCode;

    if (!batchCodes || batchCodes.length === 0) {
      return res.status(404).json({ message: 'Batch not found for the logged-in user.' });
    }

    // Step 3: Find the batches associated with the batchCode(s)
    const batches = await Batch.find({ _id: { $in: batchCodes } }).populate('deptId tutorId');

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No batches found.' });
    }

    // Step 4: Find the students associated with these batches
    const batchIds = batches.map(batch => batch._id);
    const students = await Student.find({ batchCode: { $in: batchIds } }).populate('batchCode');

    // Step 5: Return the students and batch information
    return res.status(200).json({
      message: 'Students retrieved successfully for your batch(es).',
      students,
      batches
    });
  } catch (error) {
    console.error('Error retrieving students:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
