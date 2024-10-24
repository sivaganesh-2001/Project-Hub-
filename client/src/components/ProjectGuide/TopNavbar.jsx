import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import '../../styles/ProjectGuide/topnavbar.css';

const TopNavbar = ({ username }) => {
    return (
        <div className="top-navbar">
            <div className="welcome-message">
                Welcome, {username}
            </div>
            <div className="logout">
                <FaSignOutAlt className="logout-icon" />
            </div>
        </div>
    );
};

export default TopNavbar;
