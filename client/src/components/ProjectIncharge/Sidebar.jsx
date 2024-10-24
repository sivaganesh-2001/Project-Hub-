import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/ProjectIncharge/sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
        {
            path: "/projectincharge/update-to-guide",
            name: "Update to Guide"
        },
        {
            path: "/projectincharge/make-group",
            name: "Form Group"
        },
        
        {
            path: "/projectincharge/retrieve-students",
            name: "Retrieve Students"
        },
        {
            path: "/projectincharge/retrieve-grouped",
            name: "Retrieve Grouped"
        },
        {
            path: "/projectincharge/retrieve-ungrouped",
            name: "Retrieve Ungrouped"
        },
        {
            path: "/projectincharge/announcement",
            name: "Announcement"
        },
        {
            path: "/projectincharge/assignment",
            name: "Assignment"
        },
        {
            path: "/projectincharge/workdiary",
            name: "WorkDiary"
        },
        {
            path: "/projectincharge/evaluate",
            name: "Evaluate"
        }
    ];

    return (
        <div className="container">
            <div className="sidebar">
                <div className="top_section">
                 
                </div>
                {menuItems.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="link_text"><strong>{item.name}</strong></div>
                    </NavLink>
                ))}
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Sidebar;
