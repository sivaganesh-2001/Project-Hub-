const mongoose = require('mongoose');
const Counter = require('./counter'); // Ensure path is correct

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, unique: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  batchCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }, // Linking to Batch ObjectId
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null }, // Single Group ID or null if not grouped
  roles: { type: [String], required: true },
  tasks: [{
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: { type: String, enum: ['submitted', 'pending'], default: 'pending' }
  }],
  workDiaries: [{
    diaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkDiary' },
    status: { type: String, enum: ['submitted', 'pending'], default: 'pending' }
  }]
});

// Pre-save hook to generate studentId
studentSchema.pre('save', async function (next) {
  if (!this.isModified('studentId')) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'studentId' },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      // Format the studentId as 'STUD001', 'STUD002', etc.
      this.studentId = `STUD${String(counter.sequenceValue).padStart(3, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

module.exports = Student;
