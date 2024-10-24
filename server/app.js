const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
const facultyRoutes = require('./routes/facultyRoutes.js');
const studentRoutes = require('./routes/StudentRoutes.js');
const path = require('path');
const multer = require('multer');
const sanitize = require('sanitize-filename');


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Multiple origins in an array
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/uploads', express.static('uploads')); // Serve files in the uploads directory

app.get('/uploads/:filename', (req, res) => {
  const sanitizedFilename = sanitize(req.params.filename); // Sanitize filename
  const filePath = path.join(__dirname, 'uploads', sanitizedFilename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline'); 
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(err.status || 500).end();
    }
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});