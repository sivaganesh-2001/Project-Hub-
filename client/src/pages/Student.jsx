import React from 'react';
import Sidebar from '../components/Student/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Announcement from '../components/Student/Announcement';
import Assignment from '../components/Student/Assignment';
import WorkDiary from '../components/Student/WorkDiary';
import '../styles/Student/student.css';
import Topbar from '../components/Student/Topbar'; // Import Topbar component

const Student = () => {
    return (
        <div className="student">
            <Topbar /> {/* Topbar stays at the top */}
            <div className="main-content">
                <Sidebar /> {/* Sidebar stays fixed to the left */}
                <div className="content-area"> {/* Content area avoids overlap */}
                    <Routes>
                        <Route path="announcement" element={<Announcement />} />
                        <Route path="assignment" element={<Assignment />} />
                        <Route path="workdiary" element={<WorkDiary />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Student;
