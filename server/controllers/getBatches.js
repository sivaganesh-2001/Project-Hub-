const Faculty = require('../models/faculty');
const Batch = require('../models/batch');
const Department = require('../models/department');

exports.getBatchCodes = async (req, res) => {
    try {
        const facultyId = req.user._id;
        const faculty = await Faculty.findOne({ userId: facultyId }).populate('batchCode departmentIds').exec();

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // If the faculty is a tutor or project incharge, return their specific batch codes
        if (faculty.roles.includes('tutor') || faculty.roles.includes('projectIncharge')) {
            const batchCodes = faculty.batchCode.map(batch => batch.batchCode);
            return res.json({ batchCodes });
        }

        // If the faculty is HOD, get all batches related to their department
        if (faculty.roles.includes('hod')) {
            const departmentId = faculty.departmentIds[0]; // Assume HOD only has one department

            const batches = await Batch.find({ deptId: departmentId }).select('batchCode');
            const batchCodes = batches.map(batch => batch.batchCode);
            return res.json({ batchCodes });
        }

        return res.status(400).json({ message: 'No relevant role found to fetch batches' });
    } catch (error) {
        console.error('Error fetching batch codes:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getBatchesByDepartment = async (req, res) => {
    try {
        const facultyId = req.user._id; // Assuming you are getting the faculty ID from the user context
        const faculty = await Faculty.findOne({ userId: facultyId }).populate('departmentIds').exec();

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const departmentId = faculty.departmentIds[0]; // Assuming a faculty member can belong to only one department

        const batches = await Batch.find({ deptId: departmentId }).select('batchCode'); // Fetching batches related to the department

        if (batches.length === 0) {
            return res.status(404).json({ message: 'No batches found for this department' });
        }

        const batchCodes = batches.map(batch => batch.batchCode);
        return res.json({ batchCodes });
    } catch (error) {
        console.error('Error fetching batches by department:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
    