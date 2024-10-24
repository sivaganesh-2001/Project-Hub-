import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Student/WorkDiary.css'; // Import your CSS

const WorkDiarySubmission = () => {
  const [description, setDescription] = useState(''); // Changed title to description
  const [files, setFiles] = useState([]); // Change to an array to store multiple files
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Store selected files as an array
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description); // Changed title to description
    formData.append('studentId', 'your-student-id'); // Replace with actual student ID

    // Append each selected file to formData with the key 'file'
    files.forEach((file) => {
        formData.append('file', file); // Change 'files' to 'file'
    });

    try {
        const response = await axios.post('http://localhost:5000/api/student/submitWorkDiary', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Make sure to set the content type
            },
        });
        setMessage(response.data.message);
        setError('');
        setDescription(''); // Clear the description input after submission
        setFiles([]); // Clear the file input after submission
        document.getElementById('file-input').value = ''; // Clear the file input element
    } catch (err) {
        setError(err.response?.data?.message || 'Error submitting work diary');
        setMessage('');
    }
};


  return (
    <div className="work-diary-form-container">
      <h2>Submit Work Diary</h2>
      <form onSubmit={handleSubmit} className="work-diary-form">
        <div className="form-group">
          <label htmlFor="description">Description</label> {/* Changed label from Title to Description */}
          <input
            type="text"
            id="description" // Ensure the ID matches the one in handleFileChange
            value={description} // Use description state
            onChange={(e) => setDescription(e.target.value)} // Update state on change
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload Work Diary (PDF only)</label>
          <input
            type="file"
            id="file-input" // Ensure the ID matches the one in handleFileChange
            onChange={handleFileChange}
            required
            accept=".pdf" // Accept only PDF format
            multiple // Allow multiple file selection
          />
        </div>

        <button type="submit" className="btn">Submit Work Diary</button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default WorkDiarySubmission;
