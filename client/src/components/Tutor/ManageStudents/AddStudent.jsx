// src/components/ManageStudent/RegisterStudent.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Tutor/RegisterStudent.css';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    batchCode: '',
    groupId: '', // Group ID is optional
    roles: ['student'], // default role
  });

  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessages([]);

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'rollNo', 'batchCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setErrorMessages(missingFields.map(field => `${field} is required.`));
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', formData, config); // Adjust the URL as necessary
      setMessage('Registration successful!');

      // Reset form after successful registration
      setFormData({
        name: '',
        email: '',
        password: '',
        rollNo: '',
        batchCode: '',
        groupId: '', // Group ID remains optional
        roles: ['student'],
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessages([error.response.data.message]); // Display backend error message
      } else {
        setErrorMessages(['An unexpected error occurred.']);
      }
    }
  };

  return (
    <div className="register-student-form">
      <h2>Register Student</h2>
      {/* Display messages outside the form */}
      {errorMessages.length > 0 && (
        <div className="error-messages">
          {errorMessages.map((msg, index) => (
            <p key={index} className="error">{msg}</p>
          ))}
        </div>
      )}
      {message && <p className="success">{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={formData.rollNo}
          onChange={handleChange}
          required
        />
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
          name="groupId"
          placeholder="Group ID (optional)"
          value={formData.groupId}
          onChange={handleChange}
        />
        <button type="submit">Register Student</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
