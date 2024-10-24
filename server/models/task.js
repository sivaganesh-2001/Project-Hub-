const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  dueDate: { type: Date, required: true },
  submissions: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    submissionDate: { type: Date },
    fileUrl: { type: String },
    verified: { type: Boolean, default: false },
    notes: { type: String }
  }]
});

module.exports = mongoose.model('Task', taskSchema);
