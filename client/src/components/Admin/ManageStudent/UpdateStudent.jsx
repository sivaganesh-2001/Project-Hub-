import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Tutor/UpdateStudent.css';

const UpdateStudent = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    rollNo: '',
    batchCode: '',
    groupId: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.name && !formData.name.trim()) newErrors.name = 'Name cannot be empty';
    if (formData.rollNo && !formData.rollNo.trim()) newErrors.rollNo = 'Roll Number cannot be empty';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put('http://localhost:5000/api/auth/update', {
        ...formData,
        groupId: formData.groupId.trim() || null, // Convert to null if empty
      }, config);

      setSuccessMessage(`Student with roll number ${formData.rollNo} updated successfully.`);
      setFormData({
        email: '',
        name: '',
        rollNo: '',
        batchCode: '',
        groupId: '',
      });
      setErrors({});
      setErrorMessage('');
      console.log('Student updated:', response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update student');
    }
  };

  return (
    <div className="manage-student-form">
      <h2>Update Student</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}

        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          onChange={handleChange}
          value={formData.rollNo}
          className={errors.rollNo ? 'error' : ''}
        />
        {errors.rollNo && <span className="error-message">{errors.rollNo}</span>}

        <input
          type="text"
          name="batchCode"
          placeholder="Batch Code"
          onChange={handleChange}
          value={formData.batchCode}
        />

        <input
          type="text"
          name="groupId"
          placeholder="Group ID (optional)"
          onChange={handleChange}
          value={formData.groupId}
        />

        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default UpdateStudent;
