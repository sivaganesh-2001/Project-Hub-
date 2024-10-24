const express = require('express');
const router = express.Router();
const WorkDiary = require('../models/WorkDiary.js');
const Student = require('../models/student');
const Group = require('../models/group'); // Import multer configuration
const path = require('path');
const multer = require('multer');
const User = require('../models/User');
const Faculty = require('../models/faculty');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Naming the file with a timestamp
  }
});

// Filter for allowing only PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false);
  }
};

// Multer upload middleware for a single file
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Submit work diary with file upload
exports.submitWorkDiary = [
  upload.array('file'), // Use .array() to accept multiple files
  async (req, res) => {
      const description = req.body.description; // Extract the description
      const userId = req.user._id; // Extract userId from authenticated user

      try {
          // Ensure files are uploaded
          if (!req.files || req.files.length === 0) {
              return res.status(400).json({ message: 'No files uploaded. Please upload valid PDFs.' });
          }

          // Ensure all uploaded files are PDFs
          const invalidFile = req.files.find(file => file.mimetype !== 'application/pdf');
          if (invalidFile) {
              return res.status(400).json({ message: 'Only PDF files are allowed for submission.' });
          }

          // Fetch the student's details from the logged-in user
          const student = await Student.findOne({ userId }).populate('groupId');
          if (!student || !student.groupId) {
              return res.status(404).json({ message: 'Student or group not found.' });
          }

          // Create a new work diary entry
          const workDiary = new WorkDiary({
              studentId: student._id,
              groupId: student.groupId._id,
              fileUrls: req.files.map(file => file.path), // Store the file paths
              description, // Use the provided description
              submissionDate: Date.now(), // Set the current date and time
          });

          // Save the new work diary entry
          await workDiary.save();

          // Update student's work diaries with the new entry
          student.workDiaries.push({ diaryId: workDiary._id, status: 'submitted' });
          await student.save();

          res.status(200).json({ message: 'Work diary submitted successfully.', workDiary });
      } catch (error) {
          console.error('Error submitting work diary:', error);
          res.status(500).json({ message: 'An error occurred while submitting the work diary.', error: error.message });
      }
  }
];


exports.getWorkDiaryForGuide = async (req, res) => {
  const userId = req.user._id; 
  try {
    const faculty = await Faculty.findOne({ userId }).populate('groupIds');
    console.log('faculty',faculty);
    console.log('workdiary', faculty.groupIds);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const workDiaries = await WorkDiary.find({ groupId: { $in: faculty.groupIds } })
      .populate('studentId', 'name') // Populate student name
      .populate('groupId', 'groupId') // Populate group ID
      .sort({ submissionDate: -1 }) // Sort by submissionDate descending
     

    if (!workDiaries.length) {
      return res.status(200).json({ message: 'No work diaries found for your groups' });
    }
    // Step 3: Return all work diaries
    res.status(200).json(workDiaries);
  } catch (error) {
    console.error('Error retrieving work diaries:', error);
    res.status(500).json({ message: 'An error occurred while retrieving work diaries.', error: error.message });
  }
};

exports.updateWorkDiaryStatus = async (req, res) => {
  const { id } = req.params; // WorkDiary ID passed as URL parameter
  const { notes } = req.body; // Accept the comments (notes) from the request body

  try {
    // Update the work diary status to 'viewed' and also update the notes (if provided)
    const updateData = { status: 'viewed' };
    if (notes) {
      updateData.notes = notes; // Add notes to the update object if provided
    }

    const workDiary = await WorkDiary.findByIdAndUpdate(
      id,
      { $set: updateData }, // Update status and notes (if provided)
      { new: true }
    );

    if (!workDiary) {
      return res.status(404).json({ message: 'Work diary not found' });
    }

    res.status(200).json({ message: 'Work diary status updated to viewed and notes updated (if provided).', workDiary });
  } catch (error) {
    console.error('Error updating work diary status and notes:', error);
    res.status(500).json({ message: 'An error occurred while updating the work diary.', error: error.message });
  }
};


