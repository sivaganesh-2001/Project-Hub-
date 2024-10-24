import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/DisplayStudents.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Assuming token for API authorization

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/retrieveStudentsOfTutor', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setStudents(response.data.students);
      } catch (err) {
        setError('Error fetching students');
      }
    };

    fetchStudents();
  }, [token]);

  // Function to select a student from the list
  const handleStudentClick = (student) => {
    setSelectedStudent(student); // Set the selected student to display details in the form
  };

  return (
    <div className="student-list-container">
      <h2>Student List</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Grid of students */}
      <div className="student-grid">
        {students.map((student) => (
          <div
            key={student._id}
            className={`student-card ${selectedStudent && selectedStudent._id === student._id ? 'active' : ''}`}
            onClick={() => handleStudentClick(student)}
          >
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll No:</strong> {student.rollNo}</p>
            <p><strong>Batch Code:</strong> {student.batchCode.batchCode}</p>
          </div>
        ))}
      </div>

      {/* Student Details Form */}
      {selectedStudent && (
        <div className="student-details-form">
          <h3>Details for {selectedStudent.name}</h3>
          <form className="details-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={selectedStudent.name}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="rollno">Roll No</label>
              <input
                type="text"
                id="rollno"
                value={selectedStudent.rollNo}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="batchCode">Batch Code</label>
              <input
                type="text"
                id="batchCode"
                value={selectedStudent.batchCode.batchCode}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={selectedStudent.email}
                readOnly
              />
            </div>
            {/* Add more fields if required */}
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentList;
