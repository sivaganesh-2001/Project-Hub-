import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Student from '../pages/Student';

const StudentRoutes = () => (
  <Routes>
    <Route path="/" element={<Student />} />
    {/* Add more student-specific routes here */}
  </Routes>
);

export default StudentRoutes;
