import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/ProjectGuide/sidebar.css';

const Sidebar = () => {
    const menuItem = [
        {
            path: "/projectguide/viewGroups",
            name: "View Groups"
        },
        {
            path: "/projectguide/announcement",
            name: "Announcement"
        },
        {
            path: "/projectguide/assignment",
            name: "Assignment"
        },
        {
            path: "/projectguide/submitted-assignment",
            name: "Submitted-Assignemnt"
        },
        {
            path: "/projectguide/workdiary",
            name: "Work Diary"
        },
        {
            path: "/projectguide/evaluate",
            name: "Evaluate"
        }
    ];

    return (
        <div className="sidebar">
            <h1 className="logo">Project Guide</h1>
            {menuItem.map((item, index) => (
                <NavLink to={item.path} key={index} className="link" activeClassName="active">
                    <div className="link_text">
                        {item.name}
                    </div>
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;
