import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../pages/AdminPage.jsx';

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminPage />} />
    {/* Add more admin-specific routes here */}
  </Routes>
);

export default AdminRoutes;
