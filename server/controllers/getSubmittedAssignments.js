const mongoose = require('mongoose');
const Assignment = require('../models/assignments');
const Batch = require('../models/batch');
const Group = require('../models/group');
const Faculty = require('../models/faculty');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');

exports.getAssignmentDetails = async (req, res) => {
    const assignmentId = req.params.assignmentId; // Get assignment ID from the request parameters
    const userId = req.user._id; // Get user ID from the request
  
    try {
      // Fetch the assignment by ID, populating the submissions with student details
      const assignment = await Assignment.findById(assignmentId)
        .populate({
          path: 'submissions.studentId', // Populate the studentId field in submissions
          select: 'name rollNo' // Select only the name and rollNo fields
        })
        .populate('postedBy', 'name'); // Populate the faculty who posted the assignment
  
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
  
      // Step 3: Return assignment details and submissions
      const submissionDetails = assignment.submissions.map(submission => ({
        rollNo: submission.studentId.rollNo, // Roll number of the student
        name: submission.studentId.name, // Name of the student
        submissionDate: submission.submissionDate, // Submission date
        fileUrl: submission.fileUrl // Link to the submitted PDF
      }));
  
      res.status(200).json({
        assignmentTitle: assignment.title,
        assignmentDescription: assignment.description,
        postedBy: assignment.postedBy.name,
        postDate: assignment.postDate,
        dueDate: assignment.dueDate,
        submissions: submissionDetails
      });
    } catch (error) {
      console.error('Error retrieving assignment details:', error);
      res.status(500).json({ message: 'An error occurred while retrieving assignment details.', error: error.message });
    }
  };
  