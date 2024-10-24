// src/components/ManageStudent/ViewStudent.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Tutor/ViewStudent.css';

const ViewStudent = () => {
  const [email, setEmail] = useState(''); // State for storing email input
  const [studentDetails, setStudentDetails] = useState(null); // State for storing student details
  const [message, setMessage] = useState(''); // State for success messages
  const [error, setError] = useState(''); // State for storing error messages

  const handleFetchStudent = async () => {
    setMessage(''); // Reset success message
    setError(''); // Reset error message

    if (!email) {
      setError('Email is required'); // Validation for empty email
      return;
    }

    try {

      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await axios.post('http://localhost:5000/api/faculty/view', 
        { email }, // Pass email in request body
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include authorization token
            'Content-Type': 'application/json', // Ensure Content-Type is application/json
          },
        }
      );

      setStudentDetails(response.data.student); // Set student details from response
      setMessage('Student details fetched successfully.'); // Set success message
      console.log('Fetched student details:', response.data.student); // Log fetched data for debugging
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Student not found or an error occurred while fetching data.'); // Handle errors
      setStudentDetails(null);
    }
  };

  return (
    <div className="view-student-container">
      <h2>View Student Details</h2>
      <input
        type="email"
        placeholder="Enter Student Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleFetchStudent}>Fetch Details</button>

      {message && <div className="success-message">{message}</div>} {/* Display success message */}
      {error && <div className="error-message">{error}</div>} {/* Display error message */}

      {studentDetails && (
        <div className="student-details">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {studentDetails.name || 'N/A'}</p>
          <p><strong>Email:</strong> {studentDetails.email || 'N/A'}</p>
          <p><strong>Roll No:</strong> {studentDetails.rollNo || 'N/A'}</p>
          <p><strong>Group ID:</strong> {studentDetails.groupId || 'N/A'}</p>
          <p><strong>Batch Code:</strong> {studentDetails.batchCode || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
