import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Hod/UpdateFaculty.css';

const UpdateFaculty = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    designation: '',
    departmentIds: '',
    roles: [], // Store roles as an array
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = ['projectGuide', 'projectIncharge', 'hod', 'tutor'];
  const designations = ['Professor', 'Assistant Professor', 'Associate Professor', 'HOD'];

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === 'roles') {
      const selectedRoles = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({ ...formData, [name]: selectedRoles });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.name && !formData.name.trim()) newErrors.name = 'Name cannot be empty';
    if (formData.phone && !formData.phone.trim()) newErrors.phone = 'Phone cannot be empty';
    if (formData.password && !formData.password.trim()) newErrors.password = 'Password cannot be empty';

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

      const response = await axios.put('http://localhost:5000/api/faculty/update', {
        ...formData,
        roles: formData.roles,
        departmentIds: formData.departmentIds.split(',').map(id => id.trim()),
      }, config);

      setSuccessMessage(`Faculty with email ${formData.email} updated successfully.`);
      setFormData({
        email: '',
        name: '',
        phone: '',
        designation: '',
        departmentIds: '',
        roles: [],
        password: '',
      });
      setErrors({});
      setErrorMessage('');
      console.log('Faculty updated:', response.data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update faculty');
    }
  };

  return (
    <div className="manage-faculty-form">
      <h2>Update Faculty</h2>
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
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}

        <select
          name="designation"
          onChange={handleChange}
          value={formData.designation}
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
          name="departmentIds"
          placeholder="Department ID(s)"
          onChange={handleChange}
          value={formData.departmentIds}
        />

        <div className="custom-multi-select">
          <div className="multi-select-input" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {formData.roles.length ? formData.roles.join(', ') : 'Select Roles'}
          </div>
          {isDropdownOpen && (
            <div className="multi-select-dropdown">
              {roles.map((role, index) => (
                <div key={index} className="multi-select-option">
                  <input
                    type="checkbox"
                    value={role}
                    checked={formData.roles.includes(role)}
                    onChange={(e) => {
                      const selectedRoles = [...formData.roles];
                      if (e.target.checked) {
                        selectedRoles.push(role);
                      } else {
                        const index = selectedRoles.indexOf(role);
                        selectedRoles.splice(index, 1);
                      }
                      setFormData({ ...formData, roles: selectedRoles });
                    }}
                  />
                  <label>{role}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}

        <button type="submit">Update Faculty</button>
      </form>
    </div>
  );
};

export default UpdateFaculty;
