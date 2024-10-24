import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import AddFaculty from '../components/Admin/ManageFaculty/AddFaculty';
import ViewFaculty from '../components/Admin/ManageFaculty/ViewFaculty';
import UpdateFaculty from '../components/Admin/ManageFaculty/UpdateFaculty';
import RemoveFaculty from '../components/Admin/ManageFaculty/RemoveFaculty';
import AddStudent from '../components/Admin/ManageStudent/AddStudent';
import ViewStudent from '../components/Admin/ManageStudent/ViewStudent';
import UpdateStudent from '../components/Admin/ManageStudent/UpdateStudent';
import RemoveStudent from '../components/Admin/ManageStudent/RemoveStudent';
import AddDepartment from '../components/Admin/ManageDepartment/addDepartment';
import DepartmentGrid from '../components/Admin/ManageDepartment/viewDepartment';
import UpdateDepartment from '../components/Admin/ManageDepartment/UpdateDepartment';
import RemoveDepartment from '../components/Admin/ManageDepartment/deleteDepartment';
import Topbar from '../components/Admin/Topbar'; // Import Topbar component
import '../styles/Admin/AdminPage.css';

const AdminPage = () => {
  const location = useLocation();

  // Determine the component to render based on the URL
  const renderComponent = () => {
    switch (location.pathname) {
      case '/admin/add-faculty':
        return <AddFaculty />;
      case '/admin/view-faculty':
        return <ViewFaculty />;
      case '/admin/update-faculty':
        return <UpdateFaculty />;
      case '/admin/remove-faculty':
        return <RemoveFaculty />;
      case '/admin/add-student':
        return <AddStudent />;
      case '/admin/view-student':
        return <ViewStudent />;
      case '/admin/update-student':
        return <UpdateStudent />;
      case '/admin/remove-student':
        return <RemoveStudent />;
      case '/admin/add-department':
        return <AddDepartment />;
      case '/admin/view-department':
        return <DepartmentGrid />;
      case '/admin/update-department':
        return <UpdateDepartment />;
      case '/admin/remove-department':
        return <RemoveDepartment />;
      default:
        return <div>Welcome, Admin!!!</div>;
    }
  };

  return (
    <div className="admin-container">
      {/* Topbar at the top */}
      <Topbar />

      <div className="content-section">
        {/* Sidebar to update URL and component */}
        <Sidebar />
        <div className="main-content">
          {/* Renders the component based on the URL */}
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
