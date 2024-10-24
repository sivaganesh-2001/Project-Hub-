const mongoose = require('mongoose'); // Assuming groupId is ObjectId
const Student = require('../../models/student.js');
const Batch = require('../../models/batch');
const Department = require('../../models/department');
const Faculty = require('../../models/faculty');
const Group = require('../../models/group.js')

exports.getGroupedStudentsInBatch = async (req, res) => {
  const { batchCode } = req.body;

  try {
    // Step 1: Find the batch and retrieve grouped students
    const batch = await Batch.findOne({ batchCode });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Step 2: Retrieve students with a non-null groupId
    const groupedStudents = await Student.find({
      batchCode: batch._id,
      groupId: { $exists: true, $type: 'objectId' } // Make sure groupId exists and is a valid ObjectId
    }).populate('groupId'); // Optionally populate group details if needed

    if (groupedStudents.length === 0) {
      return res.status(404).json({ message: 'No grouped students found in this batch.' });
    }

    res.status(200).json({ groupedStudents });
  } catch (error) {
    console.error('Error fetching grouped students for batch:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
