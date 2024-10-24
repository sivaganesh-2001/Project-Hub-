const mongoose = require('mongoose'); // Assuming groupId is ObjectId
const Student = require('../../models/student.js');
const Batch = require('../../models/batch');
const Department = require('../../models/department');
const Faculty = require('../../models/faculty');
const Group = require('../../models/group.js')

exports.getGroupsForProjectGuide = async (req, res) => {
    try {
        const facultyId = req.user._id; // Get the logged-in faculty's ID from the user context
        const faculty = await Faculty.findOne({ userId: facultyId }).populate('groupIds').exec();

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
            console.log('faculty',faculty);
        // Fetch groups that are associated with the faculty's groupIds
        const groups = await Group.find({ projectGuide: faculty._id }).populate({
            path: 'students',
            select: 'name rollNo batchCode', // Select fields to return
            populate: {
                path: 'batchCode',
                select: 'batchCode', // Select the batchCode to return with student info
            }
        });

        if (groups.length === 0) {
            return res.status(404).json({ message: 'No groups found for this faculty' });
        }

        // Prepare response data
        const response = groups.map(group => ({
            groupId: group.groupId,
            students: group.students.map(student => ({
                name: student.name,
                rollNo: student.rollNo,
                batchCode: student.batchCode.batchCode // Getting the batch code from the populated data
            }))
        }));
        return res.json(response);
    } 
    catch (error) {
        console.error('Error fetching groups for project guide:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
