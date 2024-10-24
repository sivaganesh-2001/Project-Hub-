import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/Admin/ViewStudent.css'; // Ensure this path points to your CSS file

const ViewStudents = () => {

  const [students, setStudents] = useState([]); // State to store student data
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading status

  // Function to fetch student details from API
  const fetchStudents = async () => {
    setLoading(true);
    setError(''); // Reset error message

    try {
      const response = await axios.get('http://localhost:5000/api/auth/getAllStudents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
        },
      });

      setStudents(response.data.students); // Set the fetched students data
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to fetch student details.'); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="view-students-container">
      <h2>Student Details</h2>
      {loading && <p>Loading...</p>} {/* Show loading message */}
      {error && <div className="error-message">{error}</div>} {/* Display error message */}

      {!loading && students.length > 0 && (
        <table className="students-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department ID</th>
              <th>Batch Code</th> {/* Added Batch Code to the table */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.rollNo}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.departmentId}</td>
                <td>{student.batchCode}</td> {/* Display Batch Code */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && students.length === 0 && (
        <p>No students found.</p> // Message if no students are available
      )}
    </div>
  );
};

export default ViewStudents;
