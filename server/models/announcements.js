const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [String], // Array of strings for URLs or file references
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  postedByRole: {
    type: String,
    enum: ['tutor', 'projectIncharge', 'projectGuide', 'hod'],
    required: true
  },
  groupIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  batchCode: {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    // required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});

// Validation for groupIds based on role
announcementSchema.pre('save', function (next) {
  if (this.postedByRole !== 'projectGuide' && this.groupIds.length > 0) {
    return next(new Error('Group IDs should only be specified if the announcement is posted by a Project Guide.'));
  }
  next();
});

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
