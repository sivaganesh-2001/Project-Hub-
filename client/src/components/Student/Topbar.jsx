import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate to redirect after logout
import '../../styles/Topbar.css'; // Import your CSS file for styling
import { FiLogOut } from 'react-icons/fi'; // Import an icon from react-icons

const Topbar = () => {
    const navigate = useNavigate();

    // Logout function to clear localStorage and redirect to the login page
    const handleLogout = () => {
        console.log('Logging out...');
        console.log('Before logout:', localStorage); // Log current localStorage

        // Clear all relevant localStorage items
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('roles');  // Remove role
        // Add any other items you wish to clear, e.g.:
        // localStorage.removeItem('userInfo');

        console.log('After logout:', localStorage); // Log localStorage after clearing

        // Redirect to login or homepage after logging out
        navigate('/login'); // Adjust the path as per your route setup
    };

    return (
        <div className="topbar">
            <div className="topbar-admin">
                Welcome Student!
            </div>
            <div className="topbar-logout">
                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut className="logout-icon" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Topbar;
