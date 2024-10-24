const express = require('express');
const router = express.Router();
const { register, loginUser, updateUser, viewUser, deleteUser } = require('../controllers/registerController');
const { getAllFaculty } = require('../controllers/retrieval/getAllFaculty.js');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const { getAllStudents } = require('../controllers/retrieval/getAllStudents.js');
const {
    createBatch,
    getAllBatches,
    getBatchByCode,
    updateBatch,
    deleteBatch
} = require('../controllers/batchController');
const {
    addDepartment,
    getDepartment,
    getDepartmentByCode,
    updateDepartment,
    deleteDepartment,
    getAllDepartments
} = require('../controllers/deptController');

// Route for registering a new user
router.post('/register', register);

// Route for updating a user
router.put('/update', updateUser);

// Route to view a user
router.post('/view', viewUser);

// Route for deleting a user
router.delete('/delete', deleteUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route to add a new department (Only admin can add)
router.post('/addDepartment', authenticate, authorizeRole('admin'), addDepartment);

// Route to get a department
router.get('/getDepartment', authenticate, authorizeRole('admin'), getDepartment);

// Route to get a department by its code
router.post('/getDepartmentByCode', authenticate, authorizeRole('admin'), getDepartmentByCode);

// Route to get all departments (for displaying in a grid)
router.get('/getAllDepartments', authenticate, authorizeRole('admin'), getAllDepartments);

// Route to update a department
router.put('/updateDepartment/:deptId', authenticate, authorizeRole('admin'), updateDepartment);

// Route to delete a department
router.delete('/deleteDepartment/:deptId', authenticate, authorizeRole('admin'), deleteDepartment);

// Route to create a new batch
router.post('/createBatch', createBatch);

// Route to get all batches
router.get('/getBatch', getAllBatches);

// Route to get a specific batch by batchCode
router.post('/getBatchByCode', getBatchByCode);

// Route to update batch (faculty, department, batchCode, etc.)
router.put('/updateBatch', updateBatch);

// Route to delete a batch by batchCode
router.delete('/deleteBatch', deleteBatch);

router.get('/getAllFaculty',authenticate,getAllFaculty );


router.get('/getAllStudents',authenticate,getAllStudents);

module.exports = router;
