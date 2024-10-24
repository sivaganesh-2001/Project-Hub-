const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  marks: { type: Number, required: true },
  feedback: { type: String, required: true },
  evaluationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
