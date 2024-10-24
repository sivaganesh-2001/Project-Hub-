  const mongoose = require('mongoose');

  const workDiarySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    submissionDate: { type: Date, default: Date.now, required: true },
    description: { type: String, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    fileUrls: [{ type: String, required: true }],
    status: { 
      type: String, 
      enum: ['unviewed', 'viewed'], 
      default: 'unviewed' 
    },
    notes: { type: String }  // Notes for comments
  });

  module.exports = mongoose.model('WorkDiary', workDiarySchema);
