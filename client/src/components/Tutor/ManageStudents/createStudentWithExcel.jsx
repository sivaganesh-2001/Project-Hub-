// src/components/Tutor/ManageStudents/CreateStudentWithExcel.jsx
import React, { useState } from 'react';
// import '../../styles/Tutor/CreateStudentWithExcel.css';

const CreateStudentWithExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please upload a CSV file.");
      return;
    }
    // For now, just log the selected file. Later, this will convert to JSON and process it.
    console.log('File uploaded:', selectedFile);
    // Add logic here to upload the file to the backend and convert it to JSON
  };

  return (
    <div className="create-student-container">
      <h2>Create Students from CSV</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="file-upload-label">
          Choose CSV File:
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button type="submit" className="upload-btn">Upload and Process</button>
      </form>
    </div>
  );
};

export default CreateStudentWithExcel;
