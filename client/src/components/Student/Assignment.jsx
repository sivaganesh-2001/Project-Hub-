import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Student/Assignment.css'; // Ensure this path is correct

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch assignments from the server
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/student/getAssignment', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAssignments(response.data.assignments);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while fetching assignments.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments when component mounts
  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file.');
      setFile(null);
    } else {
      setErrorMessage(''); // Reset error message if file is valid
      setFile(selectedFile);
    }
  };

  // Handle assignment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignmentId', selectedAssignmentId); // Ensure this matches your backend

      const response = await axios.post('http://localhost:5000/api/student/submitAssignment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccessMessage(response.data.message);
      setSelectedAssignmentId(null);
      setFile(null);
      document.getElementById('file-input').value = ''; // Clear the input field
      fetchAssignments(); // Refresh the assignments list after submission
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while submitting the assignment.');
    }
  };

  return (
    <div className="assignments">
      <h2>Assignments</h2>

      {loading ? (
        <p>Loading assignments...</p>
      ) : errorMessage ? (
        <p className="message error">{errorMessage}</p>
      ) : (
        <>
          {assignments.length > 0 ? (
            <ul className="assignment-list">
              {assignments.map((assignment) => (
                <li key={assignment._id} className="assignment-item">
                  <div className="assignment-info">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    
                    {assignment.attachments.length > 0 && (
                      <div>
                        <strong>Attachments:</strong>
                        <ul>
                      {assignment.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                              href={`http://localhost:5000/${attachment}`} // Append uploads folder correctly
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'blue', textDecoration: 'underline' }}
                            >
                              {attachment}
                            </a>

                        </li>
                      ))}
                    </ul>
                      </div>
                    )}

                    {assignment.fileUrl && (
                      <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                        View or Download Assignment PDF
                      </a>
                    )}

                    {assignment.isSubmitted ? (
                      <div className="submitted-info">
                        <p className="success">Assignment Submitted</p>
                        {assignment.submittedFile && (
                          <a href={assignment.submittedFile} target="_blank" rel="noopener noreferrer" className="download-link">
                            View Submitted File
                          </a>
                        )}
                      </div>
                    ) : (
                      <button 
                        className="submit-btn"
                        onClick={() => setSelectedAssignmentId(assignment._id)}
                      >
                        Submit Assignment
                      </button>
                    )}
                  </div>

                  {selectedAssignmentId === assignment._id && !assignment.isSubmitted && (
                    <form onSubmit={handleSubmit} className="upload-form">
                      <input
                        type="file"
                        id="file-input"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                      />
                      <button type="submit" className="upload-btn">Upload</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments found for your batch.</p>
          )}
        </>
      )}

      {successMessage && <p className="message success">{successMessage}</p>}
    </div>
  );
};

export default Assignments;
