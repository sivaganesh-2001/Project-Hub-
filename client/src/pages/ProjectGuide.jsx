// src/pages/ProjectGuide.jsx
import React from 'react';
import Sidebar from '../components/ProjectGuide/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Announcement from '../components/ProjectGuide/Announcements';
import Assignment from '../components/ProjectGuide/Assignment';
import WorkDiary from '../components/ProjectGuide/WorkDiary';
import Evaluate from '../components/ProjectGuide/Evaluate';
import '../styles/ProjectGuide/projectguide.css';
import SubmittedAssignment from '../components/ProjectGuide/studentAssignment';
import RetrieveStudentsByGuide from '../components/ProjectGuide/RetrieveGuideStudents';
import Topbar from '../components/ProjectGuide/Topbar'; // Import Topbar component

const ProjectGuide = () => {
    return (
        <div className="project-guide">
            <Topbar /> {/* Add Topbar here */}
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <Routes>
                        <Route path="viewGroups" element={<RetrieveStudentsByGuide />} />
                        <Route path="announcement" element={<Announcement />} />
                        <Route path="assignment" element={<Assignment />} />
                        <Route path="submitted-assignment" element={<SubmittedAssignment />} />
                        <Route path="workdiary" element={<WorkDiary />} />
                        <Route path="evaluate" element={<Evaluate />} />


                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ProjectGuide;
