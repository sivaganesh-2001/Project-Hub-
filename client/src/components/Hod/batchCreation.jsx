import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Hod/BatchCreation.css'; // Assume this file contains styling

const BatchCreation = () => {
  const [formData, setFormData] = useState({
    batchCode: '',
    tutorRegNumber: '',
    projectInchargeRegNumber: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('http://localhost:5000/api/faculty/createBatch', formData, config);

      setSuccessMessage('Batch created successfully!');
      setErrorMessage('');
      
      // Clear form data after successful submission
      setFormData({
        batchCode: '',
        tutorRegNumber: '',
        projectInchargeRegNumber: ''
      });

      // Clear success message after 7 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 7000);

    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.error || 'Failed to create batch');
      
      // Clear error message after 7 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 7000);
    }
  };

  return (
    <div className="batch-creation-form">
      <h2>Create Batch</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="batchCode"
          placeholder="Batch Code"
          value={formData.batchCode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tutorRegNumber"
          placeholder="Tutor Registration Number"
          value={formData.tutorRegNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="projectInchargeRegNumber"
          placeholder="Project Incharge Registration Number"
          value={formData.projectInchargeRegNumber}
          onChange={handleChange}
        />
        <button type="submit">Create Batch</button>
      </form>
    </div>
  );
};

export default BatchCreation;
