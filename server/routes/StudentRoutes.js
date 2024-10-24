const express = require('express');
const router = express.Router();
const { getAnnouncement } = require('../controllers/announcement.js');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const { getAssignmentsForStudent, submitAssignment} = require('../controllers/assignmentController');
const { viewAttachment } = require ('../controllers/viewAttachment.js');
const { submitWorkDiary, getWorkDiaryForGuide, updateWorkDiaryStatus  } = require('../controllers/workDiaryController');
const path = require('path');
const multer = require('multer');

// Configure multer
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed'), false); // Reject non-PDF files
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

router.get('/getAnnouncement', authenticate, authorizeRole('student'), getAnnouncement);

router.get('/getAssignment', authenticate, authorizeRole('student'), getAssignmentsForStudent);

router.post('/submitAssignment', authenticate, authorizeRole('student'), submitAssignment);

router.get('/announcements/attachments/:filename', authenticate, authorizeRole('student'), viewAttachment);

router.post('/submitWorkDiary', authenticate, authorizeRole('student'), submitWorkDiary);


module.exports = router;