const mongoose = require('mongoose');
const Announcement = require('../models/announcements');
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const Group = require('../models/group');
const User = require('../models/User');
const multer = require('multer');
const Batch = require('../models/batch');
const path = require('path');


const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false); // Reject non-PDF files
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter // Now this will work because fileFilter is already defined
});


// Post Announcement
exports.postAnnouncement = [
  upload.array('file'), // Use multer middleware to handle file uploads
  async (req, res) => {
    const { title, content, activeRole, batchCode } = req.body;
    const groupIds = req.body.groupIds || [];
    const userId = req.user._id;
    const roles = req.user.roles;

    try {
      // Check if the user has the correct role to post the announcement
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
          return res.status(400).json({ message: 'Group IDs are required for Project Guide announcements.' });
        }

        // Fetch groups by provided groupIds
        const groups = await Group.find({ groupId: { $in: groupIds } });

        // Validate if all the provided group IDs exist
        if (groups.length !== groupIds.length) {
          return res.status(400).json({ message: 'Some group IDs are invalid.' });
        }

        validGroupIds = groups.map(group => group._id); // Get the valid group object IDs
      }

      // Ensure no group-specific announcements for tutor or projectIncharge
      if ((activeRole === 'tutor' || activeRole === 'projectIncharge') && groupIds && groupIds.length > 0) {
        return res.status(400).json({ message: 'Tutors and Project Incharges cannot post group-specific announcements.' });
      }

      // Create and save the new announcement
      const announcement = new Announcement({
        title,
        content,
        postedBy: userId,
        postedByRole: activeRole,
        groupIds: activeRole === 'projectGuide' ? validGroupIds : [],
        batchCode: batchObjectId,
        postedDate: Date.now(),
        attachments: req.files.map(file => file.path)
      });

      await announcement.save();

      res.status(201).json({ message: 'Announcement posted successfully', announcement });
    } catch (error) {
      console.error('Error posting announcement:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
];

exports.getAnnouncement = async (req, res) => {
  const userId = req.user._id;
  const roles = req.user.roles;

  try {
    let announcements = [];

    // If the user is a student
    if (roles.includes('student')) {
      // Find the student by userId
      const student = await Student.findOne({ userId });

      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      const batchCode = student.batchCode;
      const groupId = student.groupId; // Student's group ID

      // Fetch announcements by batchCode or groupId
      announcements = await Announcement.find({
        $or: [
          { batchCode }, // Announcements for the batch
          { groupIds: groupId } // Announcements for the student's group
        ]
      }).sort({ postedDate: -1 }); // Sort by newest first

    } else if (roles.includes('projectGuide') || roles.includes('projectIncharge') || roles.includes('tutor') || roles.includes('hod')) {
      // If the user is a faculty member
      const faculty = await Faculty.findOne({ userId });
      const batchCode = faculty ? faculty.batchCode : null;

      // Fetch announcements by batchCode or any groupIds linked to the faculty's batch
      announcements = await Announcement.find({
        $or: [
          { batchCode }, // Announcements for the faculty's batch
          { groupIds: { $in: faculty.groupIds } } // If the faculty has groupIds (for Project Guide)
        ]
      }).sort({ postedDate: -1 }); // Sort by newest first

    } else {
      return res.status(403).json({ message: 'You are not authorized to view announcements.' });
    }

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

