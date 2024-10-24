import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Admin/UpdateDepartment.css';

const UpdateDepartment = () => {
  const [deptId, setDeptId] = useState(''); // Current department ID to search and update
  const [newDeptId, setNewDeptId] = useState(''); // New department ID
  const [description, setDescription] = useState(''); // Department description
  const [hodRegNo, setHodRegNo] = useState(''); // Optional HOD registration number
  const [message, setMessage] = useState(''); // Message for feedback

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation: Ensure that deptId, newDeptId, and description are provided
    if (!deptId || !newDeptId || !description) {
      setMessage('Department ID, new Department ID, and Department Description are required.');
      return;
    }

    try {
      // Make PUT request to update department
      const response = await axios.put(`http://localhost:5000/api/auth/updateDepartment/${deptId}`, {
        newDeptId,
        description,
        hodRegNo, // Optional field
      });

      setMessage(response.data.message);
      // Clear form fields after successful update
      setDeptId('');
      setNewDeptId('');
      setDescription('');
      setHodRegNo('');
    } catch (error) {
      // Display error message if update fails
      setMessage(
        error.response ? error.response.data.message : 'Error updating department'
      );
    }
  };

  return (
    <div>
      <h2>Update Department</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Current Department ID:</label>
          <input
            type="text"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>New Department ID:</label>
          <input
            type="text"
            value={newDeptId}
            onChange={(e) => setNewDeptId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Department Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>HOD Registration Number (optional):</label>
          <input
            type="text"
            value={hodRegNo}
            onChange={(e) => setHodRegNo(e.target.value)}
          />
        </div>

        <button type="submit">Update Department</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateDepartment;
