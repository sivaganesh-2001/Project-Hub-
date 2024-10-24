const express = require('express');
const router = express.Router();
const { register,  updateUser , viewUser, deleteUser } = require('../controllers/registerController');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const { updateToIncharge } = require('../controllers/updateToInchargeController.js');
const { updateToGuide } = require('../controllers/updateToGuideController.js');
const { getStudents } = require('../controllers/retrieval/allStudentOfBatch.js');
const { getUngroupedStudentsInBatch } = require('../controllers/retrieval/getUngroupedStudents.js');
const { getGroupedStudentsInBatch } = require('../controllers/retrieval/getGroupedStudents.js');
const { getGroupsForProjectGuide } = require('../controllers/retrieval/getGuideStudents.js');
const { getAssignmentsByFaculty, getAssignmentDetails} = require('../controllers/retrieval/getAllPostedAssignment.js');
const { createGroup } = require('../controllers/createGroupController.js');
const { createBatch } = require('../controllers/batchController.js');
const { getStudentsOfTutor } = require('../controllers/retrieval/getStudentsOfTutor.js');
const { getAnnouncement , postAnnouncement} = require('../controllers/announcement.js');
const { postAssignment, getAssignmentsForStudent} = require('../controllers/assignmentController');
const { getRoles } = require('../controllers/getRoles.js');
const { getDeptFaculty } = require('../controllers/retrieval/getAllFaculty.js');
const { getGroupIds } = require('../controllers/getGroupIds.js');
const { getBatchCodes, getBatchesByDepartment } = require('../controllers/getBatches.js');
const {getWorkDiaryForGuide, updateWorkDiaryStatus  } = require('../controllers/workDiaryController');
const { addDepartment, getDepartment, getDepartmentByCode, updateDepartment, deleteDepartment } = require('../controllers/deptController');
  
  

// Route to create faculty profile (only accessible by HOD)

router.post('/register', authenticate, authorizeRole('hod', 'tutor','admin'), register);

router.put('/update', authenticate, authorizeRole('hod', 'tutor', 'admin'), updateUser);

router.post('/view', authenticate, authorizeRole('hod', 'tutor'), viewUser);

router.delete('/delete', authenticate, authorizeRole('hod', 'tutor','admin'), deleteUser);

router.put('/updateToIncharge',  authenticate, authorizeRole('hod', 'tutor'), updateToIncharge);

router.put('/updateToGuide',  authenticate, authorizeRole('projectIncharge'), updateToGuide);

router.post('/createGroup',  authenticate, authorizeRole('projectIncharge'), createGroup);

router.post('/createBatch',  authenticate, authorizeRole('hod' , 'tutor', 'projectIncharge'), createBatch);

router.post('/retrieveStudents',  authenticate, authorizeRole('hod','tutor','projectIncharge'), getStudents);

router.get('/retrieveStudentsOfTutor',  authenticate, authorizeRole('hod','tutor','projectIncharge'), getStudentsOfTutor);

router.post('/retrieveUngroupedStudents',  authenticate, authorizeRole('projectIncharge'), getUngroupedStudentsInBatch);

router.post('/retrieveGroupedStudents',  authenticate, authorizeRole('projectIncharge'), getGroupedStudentsInBatch);

router.get('/retrieveGuideGroup',  authenticate, authorizeRole('projectGuide'), getGroupsForProjectGuide);

router.post('/postAnnouncement', authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), postAnnouncement);

router.get('/getAnnouncement', authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), getAnnouncement);

router.post('/addDepartment', authenticate, authorizeRole('admin'), addDepartment);

router.post('/getDepartment', authenticate, authorizeRole('admin'), getDepartment);

router.post('/getDepartmentbyCode', authenticate, authorizeRole('admin'), getDepartmentByCode);

router.post('/postAssignment', authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), postAssignment);

router.get('/getAssignment', authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), getAssignmentsForStudent);

router.get('/getRoles', authenticate, getRoles);

router.get('/getWorkDiary',authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), getWorkDiaryForGuide );

router.put('/updateWorkDiary',authenticate, authorizeRole('tutor' , 'hod', 'projectIncharge', 'projectGuide'), updateWorkDiaryStatus );

router.get('/getBatchCodes', authenticate , getBatchCodes);

router.get('/getGroups', authenticate , getGroupIds);

router.get('/getAssignmentDetails/:assignmentId', authenticate , getAssignmentDetails);

router.get('/getAllPostedAssignment', authenticate , getAssignmentsByFaculty);

router.get('/getBatchesByDepartment', authenticate, getBatchesByDepartment);

router.get('/getDeptFaculty',authenticate,getDeptFaculty );


module.exports = router;

