import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Hod/RegisterFaculty.css'; // Assuming previous styles exist

const AddFaculty = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    deptId: '',  
    registrationNumber: '',
    roles: [],
    batchCode: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // Control visibility of dropdown

  const roles = ['projectGuide', 'projectIncharge', 'panelMember', 'tutor', 'hod', 'admin'];
  const roleHierarchy = ['admin', 'hod', 'tutor', 'projectIncharge', 'projectGuide'];
  const designations = ['Professor', 'Assistant Professor', 'Associate Professor', 'hod', 'admin'];

  const isBatchCodeRequired = formData.roles.includes('tutor') || formData.roles.includes('projectIncharge');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === 'roles') {
      const selectedRoles = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedRoles.sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b)) // Sort by hierarchy
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (role) => {
    const updatedRoles = formData.roles.includes(role)
      ? formData.roles.filter(r => r !== role) // Remove if already selected
      : [...formData.roles, role]; // Add if not selected

    setFormData({
      ...formData,
      roles: updatedRoles.sort((a, b) => roleHierarchy.indexOf(a) - roleHierarchy.indexOf(b)), // Sort by hierarchy
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.deptId) newErrors.deptId = 'Department ID is required';  
    if (isBatchCodeRequired && !formData.batchCode) newErrors.batchCode = 'Batch Code is required for the selected role';
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

      const response = await axios.post('http://localhost:5000/api/faculty/register', formData, config);
  
      setSuccessMessage('Faculty registered successfully');
      setFormData({
        name: '',
        email: '',
        phone: '',
        designation: '',
        deptId: '',  
        registrationNumber: '',
        roles: [],
        batchCode: '',
        password: '',
      });
      setErrors({});
      setShowDropdown(false); // Hide dropdown after submission
      console.log('Faculty created:', response.data);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to add faculty' });
    }
  };

  return (
    <div className="manage-faculty-form">
      <h2>Add Faculty</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          className={errors.name ? 'error' : ''}
          required
        />
        {errors.name && <span className="error-message">{errors.name}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && <span className="error-message">{errors.password}</span>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          className={errors.phone ? 'error' : ''}
          required
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}

        <select
          name="designation"
          onChange={handleChange}
          value={formData.designation}
          required
        >
          <option value="" disabled>Select Designation</option>
          {designations.map((designation, index) => (
            <option key={index} value={designation}>
              {designation}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          onChange={handleChange}
          value={formData.registrationNumber}
          required
        />

        {/* Custom dropdown with checkboxes for roles */}
        <div className="custom-multi-select">
          <div className="multi-select-input" onClick={toggleDropdown}>
            {formData.roles.length > 0
              ? formData.roles.join(', ')  // Show selected roles
              : 'Select Roles'}
          </div>

          {showDropdown && (
            <div className="multi-select-dropdown">
              {roles.map((role) => (
                <label key={role} className="multi-select-option">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={() => handleCheckboxChange(role)}
                  />
                  <span className="checkbox-label">{role}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          name="deptId"  
          placeholder="Department ID"
          onChange={handleChange}
          value={formData.deptId}  
          required
        />
        {errors.deptId && <span className="error-message">{errors.deptId}</span>}

        {isBatchCodeRequired && (
          <>
            <input
              type="text"
              name="batchCode"
              placeholder="Batch Code"
              onChange={handleChange}
              value={formData.batchCode}
              required={isBatchCodeRequired}
            />
            {errors.batchCode && <span className="error-message">{errors.batchCode}</span>}
          </>
        )}

        <button type="submit">Add Faculty</button>

        {errors.submit && <div className="error-message">{errors.submit}</div>}
      </form>
    </div>
  );
};

export default AddFaculty;
