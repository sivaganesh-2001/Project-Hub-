const Student = require('../../models/student.js');
const Faculty = require('../../models/faculty.js'); // Assuming Faculty model for role check
const Batch = require('../../models/batch.js');
const Department = require('../../models/department.js');


exports.getAllStudents = async (req, res) => {
  try {
    // Fetch all students and populate batchCode with department details
    const students = await Student.find()
      .populate({
        path: 'batchCode', // Populate the batchCode field from the Batch model
        select: 'batchCode deptId', // Fetch batchCode and deptId from the Batch model
        populate: {
          path: 'deptId', // Within batchCode, populate the deptId field (from the Department model)
          select: 'deptId', // Only fetch the deptId field from the Department model
        },
      });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found.' });
    }

    // Format the response for each student
    res.status(200).json({
      students: students.map(student => ({
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        batchCode: student.batchCode?.batchCode || 'N/A', // Get batchCode or 'N/A' if not available
        departmentId: student.batchCode?.deptId?.deptId || 'N/A', // Get department ID from the populated deptId field or 'N/A' if not available
      })),
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students.' });
  }
};


// Route to get students based on department (similar to getDeptFaculty logic)
exports.getDeptStudents = async (req, res) => {
  try {
    const userId = req.user._id; // Extract the user ID from req.user

    // Step 1: Find the faculty using the userId
    const faculty = await Faculty.findOne({ userId }).populate('departmentIds', 'deptId name');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found.' });
    }

    const departmentIds = faculty.departmentIds.map(department => department._id); // Get the ObjectIds of the departments

    // Step 2: Fetch all students that belong to the same departments as the faculty
    const studentsInSameDept = await Student.find()
      .populate({
        path: 'batchCode',
        match: { deptId: { $in: departmentIds } }, // Only include students from relevant departments
        select: 'batchCode deptId', // Select batchCode and deptId fields
        populate: {
          path: 'deptId',
          select: 'deptId', // Select the department ID
        },
      });

    if (!studentsInSameDept || studentsInSameDept.length === 0) {
      return res.status(404).json({ message: 'No students found in the same departments.' });
    }

    // Format the response for each student
    res.status(200).json({
      students: studentsInSameDept.map(student => ({
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        batchCode: student.batchCode?.batchCode || 'N/A',
        departmentId: student.batchCode?.deptId?.deptId || 'N/A',
      })),
    });
  } catch (error) {
    console.error('Error fetching students by department:', error);
    res.status(500).json({ message: 'Server error while fetching students by department.' });
  }
};

