const Student = require('../models/student');
const Group = require('../models/group');
const Faculty = require('../models/faculty');
const Batch = require('../models/batch');

exports.createGroup = async (req, res) => {
  const { batchCode, studentRollNos, projectGuideRegNo } = req.body;
  
  try {
    // Step 1: Fetch the projectIncharge who is creating the group (assume we have the faculty's user ID from authentication)
    const projectInchargeId = req.user._id;  // Assuming you have a middleware that populates req.user with authenticated faculty details
    
    // Fetch the projectIncharge from the Faculty collection
    const projectIncharge = await Faculty.findOne({ userId: projectInchargeId });

    // if (!projectIncharge || !projectIncharge.roles.includes('projectIncharge')) {
    //   return res.status(403).json({ message: 'Only a Project Incharge can create groups.' });
    // }

    // Step 2: Fetch the batch by batchCode from the body
    const batch = await Batch.findOne({ batchCode });

    if (!batch) {
      return res.status(400).json({ message: 'Batch not found.' });
    }

    // Step 3: Ensure the projectIncharge is linked to this batch
    // if (projectIncharge.batchCode.toString() !== batch._id.toString()) {
    //   return res.status(403).json({ message: 'You are not authorized to create groups for this batch.' });
    // }

    // Step 4: Fetch students by roll numbers from the body, only ungrouped students in this batch
    const students = await Student.find({
      rollNo: { $in: studentRollNos },
      batchCode: batch._id,  // Ensure they belong to the same batch
      groupId: null,  // Only ungrouped students
    });

    if (students.length === 0) {
      return res.status(400).json({ message: 'Some error with students' });
    }

    // Step 5: Fetch Project Guide by registration number (optional, can be null)
    let projectGuide = null;
    if (projectGuideRegNo) {
      projectGuide = await Faculty.findOne({ registrationNumber: projectGuideRegNo });

      if (!projectGuide || !projectGuide.roles.includes('projectGuide')) {
        return res.status(400).json({ message: 'Invalid Project Guide registration number.' });
      }
    }

    // Step 6: Generate the next groupId
    const lastGroup = await Group.findOne().sort({ groupId: -1 });  // Find the group with the highest groupId
    const newGroupId = lastGroup ? lastGroup.groupId + 1 : 1;  // If no group exists, start with 1

    // Step 7: Create the new group
    const newGroup = new Group({
      groupId: newGroupId,
      batchCode: batch._id,  // Associate group with the batch
      students: students.map(student => student._id),  // Assign student IDs to the group
      projectGuide: projectGuide ? projectGuide._id : null,  // Optional, if a project guide is assigned
      projectIncharge: projectIncharge._id,  // Automatically assign the Project Incharge who is creating this group
    });

    await newGroup.save();  // Save the new group

    // Step 8: Update students with the newly assigned groupId
    await Student.updateMany(
      { _id: { $in: students.map(student => student._id) } },
      { $set: { groupId: newGroup._id } }  // Set groupId
    );

    // Step 9: If a Project Guide is assigned, update their record with the new groupId
    if (projectGuide) {
      await Faculty.findByIdAndUpdate(projectGuide._id, {
        $addToSet: { groupIds: newGroup._id },  // Add the new group to the project guide's list of groups
      });
    }

    res.status(201).json({ message: 'Group created successfully', group: newGroup });

  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
