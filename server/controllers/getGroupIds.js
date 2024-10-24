const Faculty = require('../models/faculty');
const Batch = require('../models/batch');
const Group = require('../models/group');
const Student = require('../models/student');


exports.getGroupIds = async (req, res) => {
    try {
        const facultyId = req.user._id;
        const faculty = await Faculty.findOne({ userId: facultyId }).populate('groupIds').exec();

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Fetch the groups associated with the faculty
        const groups = await Group.find({ projectGuide: faculty._id })
            .populate('students batchCode') // Populate students and batchCode
            .exec();

        if (!groups.length) {
            return res.status(404).json({ message: 'No groups found for this faculty' });
        }

        // Prepare the response data
        const studentDetails = groups.map(group => {
            return {
                groupId: group.groupId,
                students: group.students.map(student => ({
                    rollNo: student.rollNo,
                    name: student.name,
                    batchCode: student.batchCode.batchCode // Assuming batchCode is populated
                }))
            };
        });

        return res.json({ studentDetails });
    } catch (error) {
        console.error('Error fetching students by group:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};