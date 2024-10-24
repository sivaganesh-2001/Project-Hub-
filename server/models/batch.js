  const mongoose = require('mongoose');
  const Department = require('./department');
  const Faculty = require('./faculty');

  // Batch Schema
  const batchSchema = new mongoose.Schema({
    batchCode: {
      type: String,
      required: true,
      unique: true
    },
    deptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department', // Ensure this matches the model name
      required: true
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    // New field for Project Incharge
    projectIncharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty', // Refers to the Faculty model
      default: null // Initially null, will be set later
    }
  });

  // Middleware to check the departmentId before saving
  batchSchema.pre('save', async function (next) {
    try {
      const department = await Department.findById(this.deptId);
      if (!department) {
        throw new Error('Invalid department ID');
      }
      next();
    } catch (error) {
      next(error);
    }
  });

  // Method to assign a faculty member as Project Incharge
  batchSchema.methods.assignProjectIncharge = async function(facultyId) {
    try {
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        throw new Error('Invalid faculty ID');
      }
      // Ensure that the faculty's batch matches the batchCode of this batch
      if (faculty.batchCode.toString() !== this._id.toString()) {
        throw new Error('Faculty is not assigned to this batch');
      }
      // Assign the faculty as Project Incharge
      this.projectIncharge = faculty._id;
      await this.save();
    } catch (error) {
      throw new Error(`Error assigning Project Incharge: ${error.message}`);
    }
  };

  const Batch = mongoose.models.Batch || mongoose.model('Batch', batchSchema);

  module.exports = Batch;
