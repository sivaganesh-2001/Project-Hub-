import React, { useState } from 'react';

import '../../styles/Admin/Sidebar.css';

const AdminNavbar = ({ onSelect }) => {
  const [facultyDropdown, setFacultyDropdown] = useState(false);
  const [studentDropdown, setStudentDropdown] = useState(false);

  const handleFacultyClick = () => setFacultyDropdown(!facultyDropdown);
  const handleStudentClick = () => setStudentDropdown(!studentDropdown);

  return (
    <nav>
      <ul>
        <li onClick={handleFacultyClick}>Manage Faculty</li>
        {facultyDropdown && (
          <ul>
            <li onClick={() => onSelect('AddFaculty')}>Add Faculty</li>
            <li onClick={() => onSelect('ViewFaculty')}>View Faculty</li>
            <li onClick={() => onSelect('UpdateFaculty')}>Update Faculty</li>
            <li onClick={() => onSelect('RemoveFaculty')}>Remove Faculty</li>
          </ul>
        )}
        <li onClick={handleStudentClick}>Manage Student</li>
        {studentDropdown && (
          <ul>
            <li onClick={() => onSelect('AddStudent')}>Add Student</li>
            <li onClick={() => onSelect('ViewStudent')}>View Student</li>
            <li onClick={() => onSelect('UpdateStudent')}>Update Student</li>
            <li onClick={() => onSelect('RemoveStudent')}>Remove Student</li>
          </ul>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
