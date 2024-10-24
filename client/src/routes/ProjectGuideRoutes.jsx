import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectGuide from '../pages/ProjectGuide';

const ProjectGuideRoutes = () => (
  <Routes>
    <Route path="/" element={<ProjectGuide />} />
    {/* Add more project guide-specific routes here */}
  </Routes>
);

export default ProjectGuideRoutes;
