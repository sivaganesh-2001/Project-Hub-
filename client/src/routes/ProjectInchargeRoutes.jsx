import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectIncharge from '../pages/ProjectIncharge';

const ProjectInchargeRoutes = () => (
  <Routes>
    <Route path="/" element={<ProjectIncharge />} />
    {/* Add more project incharge-specific routes here */}
  </Routes>
);

export default ProjectInchargeRoutes;
