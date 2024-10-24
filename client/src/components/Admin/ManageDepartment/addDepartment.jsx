import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/Admin/RegisterDepartment.css';

const CreateDepartment = () => {
  const [deptId, setDeptId] = useState('');
  const [description, setDescription] = useState(''); // Change departmentName to description
  const [hodRegNo, setHodRegNo] = useState(''); // Change hod to hodRegNo
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/addDepartment', {
        deptId,
        description,
        hodRegNo, // Send hodRegNo instead of hod ObjectId
      });
      setMessage(response.data.message);
      setDeptId('');
      setDescription(''); // Clear description after success
      setHodRegNo(''); // Clear hodRegNo after success
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error creating department');
    }
  };

  return (
    <div>
      <h2>Create Department</h2>
      <form onSubmit={handleSubmit}>
        <label>Department ID:</label>
        <input
          type="text"
          value={deptId}
          onChange={(e) => setDeptId(e.target.value)}
          required
        />
        <label>Department Description:</label> {/* Updated label */}
        <input
          type="text"
          value={description} // Use description instead of departmentName
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>HOD Registration Number (optional):</label> {/* Updated input for HOD's regNo */}
        <input
          type="text"
          value={hodRegNo} // Use hodRegNo instead of hod
          onChange={(e) => setHodRegNo(e.target.value)}
        />
        <button type="submit">Create Department</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateDepartment;
