// src/components/Tutor/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Tutor/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isManageStudentsOpen, setManageStudentsOpen] = useState(false);

  const toggleManageStudents = () => {
    setManageStudentsOpen(!isManageStudentsOpen);
  };

  return (
    <div className="sidebar">
      <ul>
        <li onClick={toggleManageStudents}>
          Manage Students
          <span className="arrow">{isManageStudentsOpen ? '▲' : '▼'}</span>
        </li>
        {isManageStudentsOpen && (
          <ul className="nested">
            <li onClick={() => navigate('/tutor/add-student')}>Add Student</li>
            <li onClick={() => navigate('/tutor/update-student')}>Update Student</li>
            <li onClick={() => navigate('/tutor/remove-student')}>Remove Student</li>
            <li onClick={() => navigate('/tutor/view-student')}>View Student</li>
            <li onClick={() => navigate('/tutor/create-student-with-excel')}>Create with Excel</li>
          </ul>
        )}
      </ul>
      <ul>
        <li onClick={() => navigate('/tutor/update-to-incharge')}>Update To Incharge</li>
        <li onClick={() => navigate('/tutor/announcement')}>Announcement</li>
        <li onClick={() => navigate('/tutor/assignment')}>Assignment</li>
        <li onClick={() => navigate('/tutor/evaluate')}>Evaluate</li>
        <li onClick={() => navigate('/tutor/work-diary')}>Work Diary</li>
        <li onClick={() => navigate('/tutor/display-students')}>Display Students</li>
      </ul>
    </div>
  );
};

export default Sidebar;
