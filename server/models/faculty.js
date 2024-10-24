const mongoose = require('mongoose');
const Counter = require('./counter'); // Ensure path is correct

// Faculty schema
const facultySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  facultyId: { 
    type: String, 
    unique: true 
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  designation: { 
    type: String, 
    required: true,
    enum: ['Professor', 'Assistant Professor', 'Associate Professor', 'hod']
  },

  departmentIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department',
    required: function() { 
      // Required if role includes 'hod' or 'projectIncharge'
      return this.roles.includes('hod') || this.roles.includes('projectIncharge') || this.roles.includes('tutor'); 
    },
    default: []
  }],
  groupIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
  }],
  roles: {
    type: [String],
    enum: ['projectGuide', 'projectIncharge', 'projectPanel', 'tutor', 'hod'],
  },
  batchCode: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Batch', 
    required: function() { 
      // Required if role includes 'tutor' or 'projectIncharge'
      return this.roles.includes('tutor') || this.roles.includes('projectIncharge');
    }
  }],

},
{ collection: 'faculty' });

// Middleware to generate facultyId before saving
facultySchema.pre('save', async function (next) {
  if (this.isNew && !this.facultyId) { // Only generate if facultyId is not already set
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'facultyId' },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      if (!counter || typeof counter.sequenceValue === 'undefined') {
        throw new Error('Counter document not found or sequence missing.');
      }

      this.facultyId = `FACT${String(counter.sequenceValue).padStart(3, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
