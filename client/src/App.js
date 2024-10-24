import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Admin from './pages/AdminPage.jsx';
import ProjectIncharge from './pages/ProjectIncharge.jsx';
import ProjectGuide from './pages/ProjectGuide.jsx';
import Student from './pages/Student.jsx';
import TutorPage from './pages/TutorPage.jsx';
import HodPage from './pages/HodPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import './styles/Tutor/App.css';
import '../src/'

// Set up axios interceptor globally
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const roles = JSON.parse(localStorage.getItem('roles'));

        if (token && roles) {
            setIsAuthenticated(true);
            setUserRoles(roles);
        }
    }, []);

    const handleLogin = (roles) => {
        setUserRoles(roles);
        setIsAuthenticated(true);
    };

    const hasRole = (role) => {
        return userRoles.includes(role);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                    <Route 
                        path="/" 
                        element={isAuthenticated ? (
                            <Navigate to={`/${userRoles[0]}`} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )} 
                    />

                    <Route 
                        path="/admin/*" 
                        element={isAuthenticated && hasRole('admin') ? <Admin /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/projectincharge/*" 
                        element={isAuthenticated && hasRole('projectIncharge') ? <ProjectIncharge /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/projectguide/*" 
                        element={isAuthenticated && hasRole('projectGuide') ? <ProjectGuide /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/student/*" 
                        element={isAuthenticated && hasRole('student') ? <Student /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/tutor/*" 
                        element={isAuthenticated && hasRole('tutor') ? <TutorPage /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/hod/*" 
                        element={isAuthenticated && hasRole('hod') ? <HodPage /> : <Navigate to="/login" />} 
                    />

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
