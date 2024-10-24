import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/Admin/DepartmentGrid.css'; // Your CSS for styling the grid

const DepartmentGrid = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch all departments on component mount
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/getAllDepartments'); // Correct API endpoint
      setDepartments(response.data); // Set all departments
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  return (
    <div className="department-container">
      <h2>All Departments</h2>

      {/* Displaying the departments in a grid */}
      <div className="department-grid">
        {departments.length > 0 ? (
          departments.map((department) => (
            <div key={department._id} className="department-card">
              <h3>{department.deptId}</h3>
              <p>{department.description}</p>
              <p>{department.hod ? `HOD: ${department.hod.name}` : 'No HOD assigned'}</p> {/* Display HOD name */}
            </div>
          ))
        ) : (
          <p>No departments found.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentGrid;
  