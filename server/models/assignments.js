const mongoose = require('mongoose');

// Assignment schema
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }, // Tutor, Project Incharge, or Project Guide
  batchCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }, // Only for Tutor/Project Incharge
  groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],   // Only for Project Guide
  postDate: { type: Date, default: Date.now, required: true }, // Date the assignment was posted
  dueDate: { type: Date }, // Optional field for assignment due date
  attachments: [String], // URLs for attached files
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    submissionDate: { type: Date },
    fileUrl: { type: String }, // Submitted PDF file
    verified: { type: Boolean, default: false },
    notes: { type: String }
  }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
