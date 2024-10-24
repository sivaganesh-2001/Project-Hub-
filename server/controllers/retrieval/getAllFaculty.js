const express = require('express');
const router = express.Router();
const Faculty = require('../../models/faculty'); // Ensure correct path to your faculty model

// Route to get all faculties
exports.getAllFaculty = async (req, res) => {
    try {
      // Fetch all faculties and populate department details
      const faculties = await Faculty.find().populate('departmentIds', 'deptId name'); // Include deptId in the populated fields
  
      if (!faculties || faculties.length === 0) {
        return res.status(404).json({ message: 'No faculties found.' });
      }
  
      // Return the faculties data
      res.status(200).json({
        faculties: faculties.map(faculty => ({
          _id: faculty._id,
          registrationNumber: faculty.registrationNumber,
          name: faculty.name,
          email: faculty.email,
          departmentIds: faculty.departmentIds.map(dept => dept.deptId), // Get deptId instead of ObjectId
        })),
      });
    } catch (error) {
      console.error('Error fetching faculties:', error);
      res.status(500).json({ message: 'Server error while fetching faculties.' });
    }
  };


exports.getDeptFaculty = async (req, res) => {
  try {
    const userId = req.user._id; // Correctly extract the userId from req.user (this is the ObjectId from the User model)


    // Step 1: Find the faculty using the userId
    const faculty = await Faculty.findOne({ userId }).populate('departmentIds', 'deptId name');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found.' });
    }

    const departmentIds = faculty.departmentIds.map(department => department._id); // Get the ObjectIds of the departments

    // Fetch all faculties that belong to the same departments
    const facultiesInSameDept = await Faculty.find({ departmentIds: { $in: departmentIds } }).populate('departmentIds', 'deptId name');

    if (!facultiesInSameDept || facultiesInSameDept.length === 0) {
      return res.status(404).json({ message: 'No faculties found in the same departments.' });
    }

    // Return the faculties data
    res.status(200).json({
      faculties: facultiesInSameDept.map(faculty => ({
        _id: faculty._id,
        registrationNumber: faculty.registrationNumber,
        name: faculty.name,
        email: faculty.email,
        departmentIds: faculty.departmentIds.map(dept => dept.deptId), // Return deptId instead of ObjectId
      })),
    });
  } catch (error) {
    console.error('Error fetching department faculties:', error);
    res.status(500).json({ message: 'Server error while fetching department faculties.' });
  }
};



