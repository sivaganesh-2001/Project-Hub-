import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProjectIncharge/sidebar.css';
import { FaUserGraduate, FaUserTie, FaChalkboardTeacher, FaBuilding, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="sidebar">
      {/* Adding extra space from the top */}
      <div className="sidebar-header" />

      <ul className="sidebar-menu">
        {/* Faculty Section */}
        <li
          onClick={() => toggleSection('faculty')}
          className={`menu-item ${activeSection === 'faculty' ? 'active' : ''}`}
        >
          <FaChalkboardTeacher className="menu-icon" />
          Faculty {activeSection === 'faculty' ? <FaChevronUp /> : <FaChevronDown />}
        </li>
        {activeSection === 'faculty' && (
          <ul className="submenu">
            <li onClick={() => navigate('/admin/add-faculty')}>Add Faculty</li>
            <li onClick={() => navigate('/admin/view-faculty')}>View Faculty</li>
            <li onClick={() => navigate('/admin/update-faculty')}>Update Faculty</li>
            <li onClick={() => navigate('/admin/remove-faculty')}>Remove Faculty</li>
          </ul>
        )}

        {/* Student Section */}
        <li
          onClick={() => toggleSection('student')}
          className={`menu-item ${activeSection === 'student' ? 'active' : ''}`}
        >
          <FaUserGraduate className="menu-icon" />
          Student {activeSection === 'student' ? <FaChevronUp /> : <FaChevronDown />}
        </li>
        {activeSection === 'student' && (
          <ul className="submenu">
            <li onClick={() => navigate('/admin/add-student')}>Add Student</li>
            <li onClick={() => navigate('/admin/view-student')}>View Student</li>
            <li onClick={() => navigate('/admin/update-student')}>Update Student</li>
            <li onClick={() => navigate('/admin/remove-student')}>Remove Student</li>
          </ul>
        )}

        {/* Manage Department Section */}
        <li
          onClick={() => toggleSection('department')}
          className={`menu-item ${activeSection === 'department' ? 'active' : ''}`}
        >
          <FaBuilding className="menu-icon" />
          Department {activeSection === 'department' ? <FaChevronUp /> : <FaChevronDown />}
        </li>
        {activeSection === 'department' && (
          <ul className="submenu">
            <li onClick={() => navigate('/admin/add-department')}>Add Department</li>
            <li onClick={() => navigate('/admin/view-department')}>View Department</li>
            <li onClick={() => navigate('/admin/update-department')}>Update Department</li>
            <li onClick={() => navigate('/admin/remove-department')}>Remove Department</li>
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
