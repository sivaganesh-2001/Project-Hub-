import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Student/sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/student/announcement">Announcement</Link></li>
                <li><Link to="/student/assignment">Assignment</Link></li>
                <li><Link to="/student/workdiary">WorkDiary</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
