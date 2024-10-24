import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Hod/Sidebar.css';
import { FaUserGraduate, FaUserTie, FaChalkboardTeacher, FaBuilding, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Optional header */}
      </div>

      <ul className="sidebar-menu">
        {/* Manage Faculty Section */}
        <li
          onClick={() => toggleSection('faculty')}
          className={`menu-item ${activeSection === 'faculty' ? 'active' : ''}`}
        >
          <FaChalkboardTeacher className="menu-icon" />
          Manage Faculty {activeSection === 'faculty' ? <FaChevronUp className="arrow" /> : <FaChevronDown className="arrow" />}
        </li>
        {activeSection === 'faculty' && (
          <ul className="submenu">
            <li onClick={() => navigate('/hod/add-faculty')}>Add Faculty</li>
            <li onClick={() => navigate('/hod/remove-faculty')}>Remove Faculty</li>
            <li onClick={() => navigate('/hod/update-faculty')}>Update Faculty</li>
            <li onClick={() => navigate('/hod/view-faculty')}>View Faculty</li>
          </ul>
        )}

        {/* Other Sections */}
        <li onClick={() => navigate('/hod/create-batch')} className="menu-item">
          <FaUserTie className="menu-icon" /> Batch Creation
        </li>
        <li onClick={() => navigate('/hod/announcement')} className="menu-item">
          <FaUserTie className="menu-icon" /> Announcement
        </li>
        <li onClick={() => navigate('/hod/assignment')} className="menu-item">
          <FaUserGraduate className="menu-icon" /> Assignment
        </li>
        <li onClick={() => navigate('/hod/work-diary')} className="menu-item">
          <FaBuilding className="menu-icon" /> Work Diary
        </li>
        <li onClick={() => navigate('/hod/evaluate')} className="menu-item">
          <FaBuilding className="menu-icon" /> Evaluate
        </li>
        <li onClick={() => navigate('/hod/retrieve-students')} className="menu-item">
          <FaUserGraduate className="menu-icon" /> Retrieve Students
        </li>
      </ul>

      <div className="sidebar-footer">
        {/* Optional footer */}
      </div>
    </div>
  );
};

export default Sidebar;
