// src/pages/ProjectIncharge.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/ProjectIncharge/Sidebar.jsx';
import MakeGroup from '../components/ProjectIncharge/MakeGroup.jsx';
import AssignToGuide from '../components/ProjectIncharge/updateToGuide.jsx';
import Announcement from '../components/ProjectIncharge/Announcements.jsx';
import Assignment from '../components/ProjectIncharge/Assignment.jsx';
import WorkDiary from '../components/ProjectIncharge/WorkDiary';
import Evaluate from '../components/ProjectIncharge/Evaluate.jsx';
import RetrieveStudents from '../components/ProjectIncharge/RetrieveStudents.jsx';
import RetrieveGrouped from '../components/ProjectIncharge/RetrieveGrouped.jsx';
import RetrieveUngrouped from '../components/ProjectIncharge/RetrieveUngrouped.jsx';
import '../styles/ProjectIncharge/projectincharge.css';
import Topbar from '../components/ProjectIncharge/Topbar'; // Import Topbar component

const ProjectIncharge = () => {
    return (
        <div className="project-incharge">
            <Topbar /> {/* Add the Topbar here */}
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <Routes>
                        <Route path="update-to-guide" element={<AssignToGuide />} />
                        <Route path="make-group" element={<MakeGroup />} />
                        <Route path="retrieve-students" element={<RetrieveStudents />} />
                        <Route path="retrieve-grouped" element={<RetrieveGrouped />} />
                        <Route path="retrieve-ungrouped" element={<RetrieveUngrouped />} />
                        <Route path="announcement" element={<Announcement />} />
                        <Route path="assignment" element={<Assignment />} />
                        <Route path="workdiary" element={<WorkDiary />} />
                        <Route path="evaluate" element={<Evaluate />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ProjectIncharge;
