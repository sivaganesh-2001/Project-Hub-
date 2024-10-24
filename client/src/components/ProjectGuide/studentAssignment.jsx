import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectGuide/submitAssignment.css'; // Ensure this CSS file is created

const SubmittedAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    // Fetch assignments posted by the logged-in faculty
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faculty/getAllPostedAssignment', {
          headers: { 'Authorization': `Bearer ${token}` } // Add Bearer token here
        });
        if (Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          console.warn('Expected an array but received:', response.data);
          setAssignments([]); // Set to an empty array if not an array
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching assignments');
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchAssignments();
  }, [token]);

  const handleAssignmentClick = async (assignmentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/faculty/getAssignmentDetails/${assignmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` } // Add Bearer token here
      });
      setSelectedAssignment(response.data);
    } catch (error) {
      setError('Error fetching assignment details');
      console.error('Error fetching assignment details:', error);
    }
  };

  return (
    <div className="work-diary-container">
      <h1>Your Students Submitted Assignments</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {/* List of assignments */}
      <ul className="assignments-list">
        {Array.isArray(assignments) && assignments.length > 0 ? (
          assignments.map((assignment) => (
            <li key={assignment._id} onClick={() => handleAssignmentClick(assignment._id)}>
              {assignment.title}
            </li>
          ))
        ) : (
          <li>No assignments available.</li>
        )}
      </ul>

      {/* Display assignment details if selected */}
      {selectedAssignment && (
        <div className="assignment-details">
          <h3>{selectedAssignment.assignmentTitle}</h3>
          <p>{selectedAssignment.assignmentDescription}</p>
          <p>Post Date: {new Date(selectedAssignment.postDate).toLocaleDateString()}</p>
          <p>Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>

          <h4>Submissions</h4>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Submission Date</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(selectedAssignment.submissions) && selectedAssignment.submissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.rollNo || 'N/A'}</td>
                  <td>{submission.name || 'N/A'}</td>
                  <td>{submission.submissionDate ? new Date(submission.submissionDate).toLocaleDateString() : 'Not submitted'}</td>
                  <td>
                    {/* Directly link to view PDFs */}
                    {submission.fileUrl ? (
                      <a 
                        href={`http://localhost:5000/${submission.fileUrl}`} // Adjust URL according to your server setup
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      'No PDF available'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignments;
