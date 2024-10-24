// src/pages/TutorPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Tutor/Sidebar';
import AddStudent from '../components/Tutor/ManageStudents/AddStudent.jsx'; 
import UpdateStudent from '../components/Tutor/ManageStudents/UpdateStudent.jsx'; 
import RemoveStudent from '../components/Tutor/ManageStudents/RemoveStudent.jsx'; 
import ViewStudent from '../components/Tutor/ManageStudents/ViewStudent.jsx'; 
import CreateStudentWithExcel from '../components/Tutor/ManageStudents/createStudentWithExcel.jsx';
import UpdateToIncharge from '../components/Tutor/updateToIncharge.jsx';
import Announcement from '../components/Tutor/Announcements.jsx';
import Assignment from '../components/Tutor/Assignment.jsx';
import Evaluate from '../components/Tutor/Evaluate';
import StudentList from '../components/Tutor/DisplayStudents.jsx';
import WorkDiary from '../components/Tutor/WorkDiary.jsx';
import '../styles/Tutor/TutorPage.css';
import Topbar from '../components/Tutor/Topbar'; // Import Topbar component

const TutorPage = () => {
  const location = useLocation();

  const renderComponent = () => {
    switch (location.pathname) {
      case '/tutor/add-student':
        return <AddStudent />;
      case '/tutor/update-student':
        return <UpdateStudent />;
      case '/tutor/remove-student':
        return <RemoveStudent />;
      case '/tutor/view-student':
        return <ViewStudent />;
      case '/tutor/create-student-with-excel':
        return <CreateStudentWithExcel />;
      case '/tutor/update-to-incharge':
        return <UpdateToIncharge />;
      case '/tutor/announcement':
        return <Announcement />;
      case '/tutor/assignment':
        return <Assignment />;
      case '/tutor/evaluate':
        return <Evaluate />;
      case '/tutor/display-students':
        return <StudentList />;
      case '/tutor/work-diary':
        return <WorkDiary />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="tutor-container">
      <Topbar /> {/* Add the Topbar here */}
      <div className="main-section">
        <Sidebar />
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
