// src/pages/HodPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Hod/Sidebar';
import AddFaculty from '../components/Hod/ManageFaculty/AddFaculty.jsx'; // Import Add Faculty component
import RemoveFaculty from '../components/Hod/ManageFaculty/RemoveFaculty.jsx'; // Import Remove Faculty component
import UpdateFaculty from '../components/Hod/ManageFaculty/UpdateFaculty.jsx'; // Import Update Faculty component
import ViewFaculty from '../components/Hod/ManageFaculty/ViewFaculty.jsx'; // Import View Faculty component
import Announcement from '../components/Hod/Announcement.jsx';
import Assignment from '../components/Hod/Assignment.jsx';
import WorkDiary from '../components/Hod/WorkDiary.jsx'; // Import Work Diary component
import Evaluate from '../components/Hod/Evaluate.jsx';
import RetrieveStudents from '../components/Hod/RetrieveStudents.jsx';
import BatchCreation from '../components/Hod/batchCreation.jsx';
import Topbar from '../components/Hod/Topbar'; // Import Topbar component
import '../styles/Hod/HodPage.css'; // Import the updated CSS

const HodPage = () => {
  const location = useLocation();

  const renderComponent = () => {
    switch (location.pathname) {
      case '/hod/add-faculty':
        return <AddFaculty />;
      case '/hod/remove-faculty':
        return <RemoveFaculty />;
      case '/hod/update-faculty':
        return <UpdateFaculty />;
      case '/hod/view-faculty':
        return <ViewFaculty />;
      case '/hod/announcement':
        return <Announcement />;
      case '/hod/assignment':
        return <Assignment />;
      case '/hod/work-diary':
        return <WorkDiary />;
      case '/hod/evaluate':
        return <Evaluate />;
      case '/hod/retrieve-students':
          return <RetrieveStudents />;
          case '/hod/create-batch':
            return <BatchCreation />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="hod-container">
      <Sidebar />
      <div className="content-area">
        <Topbar /> {/* Topbar added here */}
        <div className="main-content">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default HodPage;
