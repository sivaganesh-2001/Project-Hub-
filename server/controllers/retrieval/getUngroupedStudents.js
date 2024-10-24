const Student = require('../../models/student.js');
const Batch = require('../../models/batch');
const Group = require('../../models/group.js')

exports.getUngroupedStudentsInBatch = async (req, res) => {
  const { batchCode } = req.body;

  try {
    // Step 1: Find the batch
    const batch = await Batch.findOne({ batchCode });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Step 2: Retrieve students with a null or missing groupId
    const ungroupedStudents = await Student.find({
      batchCode: batch._id,
      $or: [
        { groupId: null },      // Handle null groupId
        { groupId: { $exists: false } }  // Handle missing groupId
      ]
    }).populate('groupId'); // Optionally populate group details if needed

    if (ungroupedStudents.length === 0) {
      return res.status(404).json({ message: 'No ungrouped students found in this batch.' });
    }

    res.status(200).json({ ungroupedStudents });
  } catch (error) {
    console.error('Error fetching ungrouped students for batch:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
