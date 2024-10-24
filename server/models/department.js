const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Department schema
const departmentSchema = new mongoose.Schema({
  deptId: {
    type: String,
    required: true,
    unique: true,  // Ensures that `deptId` is unique and acts as the primary identifier
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  hod: {
    type: Schema.Types.ObjectId, // Store the ObjectId of the HOD
    ref: 'Faculty', // Refers to the Faculty model where HOD is a faculty member
    required: false, // Optional initially, can be assigned later
  }
});

// No need for any pre-save middleware as `deptId` is directly entered and is the primary key
const Department = mongoose.models.department || mongoose.model('Department', departmentSchema);

module.exports = Department;
