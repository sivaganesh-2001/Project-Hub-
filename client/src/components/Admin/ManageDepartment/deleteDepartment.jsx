// DeleteDepartment.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Admin/RemoveDepartment.css';

const DeleteDepartment = () => {
  const [deptId, setDeptId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(`http://localhost:5000/api/auth/deleteDepartment/${deptId}`);
      setMessage(response.data.message);
      setDeptId('');
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error deleting department');
    }
  };

  return (
    <div>
      <h2>Delete Department</h2>
      <form onSubmit={handleDelete}>
        <label>Department ID:</label>
        <input
          type="text"
          value={deptId}
          onChange={(e) => setDeptId(e.target.value)}
          required
        />
        <button type="submit">Delete Department</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteDepartment;
