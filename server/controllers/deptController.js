// const Department = require('../models/department');

// // Controller to register (add) a new department
// exports.addDepartment = async (req, res) => {
//   const { deptId, description, hod } = req.body;

//   // Validate the input
//   if (!deptId || !description || !hod) {
//     return res.status(400).json({ message: 'Department code, description, and HOD are required.' });
//   }

//   try {
//     // Check if the department already exists
//     const existingDepartment = await Department.findOne({ deptId });
//     if (existingDepartment) {
//       return res.status(400).json({ message: 'Department code already exists.' });
//     }

//     // Create and save a new department
//     const newDepartment = new Department({
//       deptId,
//       description,
//       hod // Assuming hod is passed as the ObjectId of a Faculty member
//     });

//     await newDepartment.save();
//     res.status(201).json({ message: 'Department created successfully', department: newDepartment });
//   } catch (error) {
//     console.error('Error creating department:', error.message);
//     res.status(500).json({ message: 'An error occurred while creating the department.', error: error.message });
//   }
// };

// // Controller to get all departments
// exports.getDepartment = async (req, res) => {
//   try {
//     const departments = await Department.find();
//     res.status(200).json(departments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     res.status(500).json({ message: 'An error occurred while fetching departments.' });
//   }
// };

// // Controller to get a department by code

const Department = require('../models/department');
const Faculty = require('../models/faculty');

exports.getDepartmentByCode = async (req, res) => {
  const { deptId } = req.body; // Extract `deptId` from the request body

  if (!deptId) {
    return res.status(400).json({ message: 'Department code is required' });
  }

  try {
    // Find the department by its code
    const department = await Department.findOne({ deptId });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ departmentId: department._id, department });
  } catch (error) {
    console.error('Error fetching department by code:', error);
    res.status(500).json({ message: 'An error occurred while fetching the department.' });
  }
};


// Controller to get all departments and show in a grid
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('hod', 'name'); // Populate HOD with name
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'An error occurred while fetching departments.' });
  }
};


// Controller to get all departments or a specific department by code
exports.getDepartment = async (req, res) => {
  const { deptId } = req.query; // Extract `deptId` from the query parameters

  try {
    let departments;
    if (deptId) {
      // Find the department by its code
      departments = await Department.find({ deptId });
      if (departments.length === 0) {
        return res.status(404).json({ message: 'Department not found' });
      }
    } else {
      // If no `deptId` provided, fetch all departments
      departments = await Department.find();
    }
    
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'An error occurred while fetching departments.' });
  }
};


// Controller to register (add) a new department
exports.addDepartment = async (req, res) => {
  const { deptId, description, hodRegNo } = req.body; // Accept hodRegNo instead of hod ObjectId

  // Validate the input
  if (!deptId || !description) {
    return res.status(400).json({ message: 'Department ID and description are required.' });
  }

  try {
    // Check if the department already exists
    const existingDepartment = await Department.findOne({ deptId });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department ID already exists.' });
    }

    let hodObjectId = null;

    // Check if hodRegNo is provided and get the HOD's ObjectId from the Faculty collection
    if (hodRegNo) {
      const faculty = await Faculty.findOne({ regNo: hodRegNo }); // Assuming regNo is the alphanumeric identifier in Faculty
      if (!faculty) {
        return res.status(404).json({ message: 'HOD with the provided regNo not found in the Faculty collection.' });
      }
      hodObjectId = faculty._id; // Get the ObjectId of the HOD
    }

    // Create and save a new department
    const newDepartment = new Department({
      deptId,
      description,
      hod: hodObjectId // Assign the ObjectId of the HOD or null if not provided
    });

    await newDepartment.save();
    res.status(201).json({ message: 'Department created successfully', department: newDepartment });
  } catch (error) {
    console.error('Error creating department:', error.message);
    res.status(500).json({ message: 'An error occurred while creating the department.', error: error.message });
  }
};


// Controller to update a department
exports.updateDepartment = async (req, res) => {
  const { description, hodRegNo } = req.body;
  const { deptId } = req.params; // Extract deptId from the URL

  // Validate the input
  if (!deptId || !description) {
    return res.status(400).json({ message: 'Department ID and description are required.' });
  }

  try {
    // Find the department by its ID
    const department = await Department.findOne({ deptId });

    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    let hodObjectId = null;

    // If hodRegNo is provided, update the HOD's ObjectId from the Faculty collection
    if (hodRegNo) {
      const faculty = await Faculty.findOne({ registrationNumber: hodRegNo });
      if (!faculty) {
        return res.status(404).json({ message: 'HOD with the provided regNo not found in the Faculty collection.' });
      }
      hodObjectId = faculty._id; // Get the ObjectId of the HOD
    }

    // Update the department details
    department.description = description;
    if (hodObjectId) {
      department.hod = hodObjectId; // Update HOD only if hodRegNo is provided
    }

    await department.save();
    res.status(200).json({ message: 'Department updated successfully', department });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'An error occurred while updating the department.', error: error.message });
  }
};


// Controller to delete a department
exports.deleteDepartment = async (req, res) => {
  const { deptId } = req.params;

  // Validate the input
  if (!deptId) {
    return res.status(400).json({ message: 'Department ID is required.' });
  }

  try {
    // Find and delete the department by its ID
    const department = await Department.findOneAndDelete({ deptId });

    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'An error occurred while deleting the department.', error: error.message });
  }
};
