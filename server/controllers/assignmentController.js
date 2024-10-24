const mongoose = require('mongoose');
const Assignment = require('../models/assignments');
const Batch = require('../models/batch');
const Group = require('../models/group');
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');

// File filter to ensure only PDFs are uploaded
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false);
  }
};

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // File upload destination
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name format for uploaded files
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Posting Assignments
exports.postAssignment = [
  upload.array('files'), // Multiple file uploads
  async (req, res) => {
    const { title, description, dueDate, batchCode } = req.body;
    const groupIds = req.body.groupIds || [];
    const userId = req.user._id;
    const roles = req.user.roles;
    const activeRole = req.body.activeRole;

    try {
      // Check if the user has the correct role to post the assignment
      if (!roles.includes(activeRole)) {
        return res.status(403).json({
          message: `You are not authorized to post as this role: ${activeRole}.`
        });
      }

      let batchObjectId = null;
      let validGroupIds = [];

      // Check based on active role
      if (['hod', 'tutor', 'projectIncharge'].includes(activeRole)) {
        // For these roles, batchCode is required
        if (!batchCode) {
          return res.status(400).json({ message: 'Batch code is required for this role.' });
        }

        // Find the batch by batchCode
        const batch = await Batch.findOne({ batchCode });
        if (!batch) {
          return res.status(400).json({ message: 'Invalid batch code.' });
        }

        batchObjectId = batch._id; // Store batch ID
      } else if (activeRole === 'projectGuide') {
        // For projectGuide, groupIds are required and checked
        if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
          return res.status(400).json({ message: 'Group IDs are required for Project Guide assignments.' });
        }

        // Fetch groups by provided groupIds
        const groups = await Group.find({ groupId: { $in: groupIds } });

        // Validate if all the provided group IDs exist
        if (groups.length !== groupIds.length) {
          return res.status(400).json({ message: 'Some group IDs are invalid.' });
        }

        validGroupIds = groups.map(group => group._id); // Get the valid group object IDs
      }

      // Ensure no group-specific assignments for tutor or projectIncharge
      if ((activeRole === 'tutor' || activeRole === 'projectIncharge') && groupIds && groupIds.length > 0) {
        return res.status(400).json({ message: 'Tutors and Project Incharges cannot post group-specific assignments.' });
      }

      // Create and save the new assignment
      const assignment = new Assignment({
        title,
        description,
        postedBy: userId,
        postedByRole: activeRole,
        groupIds: activeRole === 'projectGuide' ? validGroupIds : [],
        batchCode: batchObjectId,
        dueDate,
        postDate: Date.now(),
        attachments: req.files.map(file => file.path)
      });

      await assignment.save();

      res.status(201).json({ message: 'Assignment posted successfully', assignment });
    } catch (error) {
      console.error('Error posting assignment:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
];

// Fetch Assignments for Students and Faculty
exports.getAssignmentsForStudent = async (req, res) => {
  const userId = req.user._id;
  const roles = req.user.roles;

  try {
    let assignments = [];

    // If the user is a student
    if (roles.includes('student')) {
      const student = await Student.findOne({ userId }).populate('groupId');

      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      const batchCode = student.batchCode;
      const groupId = student.groupId ? student.groupId._id : null;

      // Fetch assignments by batchCode or groupId
      assignments = await Assignment.find({
        $or: [
          { batchCode }, // Assignments for the batch
          { groupIds: { $in: [groupId] } } // Assignments for the student's group
        ]
      }).sort({ postDate: -1 }); // Sort by newest first

    } else if (roles.includes('projectGuide') || roles.includes('projectIncharge') || roles.includes('tutor') || roles.includes('hod')) {
      // If the user is a faculty member
      const faculty = await Faculty.findOne({ userId });
      const batchCode = faculty ? faculty.batchCode : null;

      // Fetch assignments by batchCode or any groupIds linked to the faculty's batch or groups
      assignments = await Assignment.find({
        $or: [
          { batchCode }, // Assignments for the faculty's batch
          { groupIds: { $in: faculty.groupIds } } // Assignments for the faculty's groups (for Project Guide)
        ]
      }).sort({ postDate: -1 }); // Sort by newest first

    } else {
      return res.status(403).json({ message: 'You are not authorized to view assignments.' });
    }

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// Submitting Assignments
  exports.submitAssignment = [
    upload.single('file'), // Single file upload
    async (req, res) => {
      const assignmentId = req.body.assignmentId;
      const userId = req.user._id;

      try {
        // Ensure a file is uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded. Please upload a valid document.' });
        }

        // Ensure assignment ID is provided
        if (!assignmentId) {
          return res.status(400).json({ message: 'Assignment ID is required.' });
        }

        // Fetch the assignment by ID
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
          return res.status(404).json({ message: 'Assignment not found.' });
        }

        // Ensure the file is a PDF
        if (req.file.mimetype !== 'application/pdf') {
          return res.status(400).json({ message: 'Only PDF files are allowed for submission.' });
        }

        // Fetch the student profile based on the userId
        const student = await Student.findOne({ userId }).populate('batchCode groupId');
        if (!student) {
          return res.status(404).json({ message: 'Student not found.' });
        }

        // Check if the student is eligible to submit
        const isEligible = (assignment.batchCode && student.batchCode.equals(assignment.batchCode._id)) ||
          (assignment.groupIds && assignment.groupIds.some(group => group.equals(student.groupId._id)));

        if (!isEligible) {
          return res.status(403).json({ message: 'You are not authorized to submit this assignment.' });
        }

        // Add the submission to the assignment
        assignment.submissions.push({
          studentId: student._id, // Store the student's ObjectId from the Student collection
          userId, // You can still store the userId for future reference
          submissionDate: Date.now(),
          fileUrl: req.file.path,
          verified: false,
        });

        await assignment.save();
        res.status(200).json({ message: 'Assignment submitted successfully.' });
      } catch (error) {
        console.error('Error submitting assignment:', error.message);
        res.status(500).json({ message: 'An error occurred while submitting the assignment.', error: error.message });
      }
    }
  ];

