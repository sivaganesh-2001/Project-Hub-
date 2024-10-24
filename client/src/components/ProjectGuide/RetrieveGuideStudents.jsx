import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectGuide/RetrieveGuideStudents.css';

const RetrieveStudentsByGuide = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // Fetch students by project guide when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/faculty/retrieveGuideGroup',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include Bearer token for authorization
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setStudents(response.data); // Assuming response.data is an array of student details
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Error retrieving students');
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [token]);

    return (
        <div className="retrieve-students-container">
            <h2>Students Under Your Guidance</h2>
            {loading && <p className="loading-message">Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {students.length > 0 && (
                <div className="students-list">
                    <h3>Students:</h3>
                    <ul>
                        {students.map((group) => (
                            <li key={group.groupId}>
                                <h4>Group ID: {group.groupId}</h4>
                                <ul>
                                    {group.students.map((student) => (
                                        <li key={student.rollNo}>
                                            <p><strong>Name:</strong> {student.name}</p>
                                            <p><strong>Roll No:</strong> {student.rollNo}</p>
                                            <p><strong>Batch Code:</strong> {student.batchCode || 'N/A'}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RetrieveStudentsByGuide;
