const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({
  groupId: { type: Number, required: true, unique: true }, // Incremented for each group
  batchCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }, // Reference to Batch
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Group members
  projectGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: false }, // Assigned Project Guide
  projectIncharge: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true }, // Project Incharge who created this group
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
