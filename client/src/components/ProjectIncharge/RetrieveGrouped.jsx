import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/RetrieveGroupedStudents.css';

const GetGroupedStudents = () => {
    const [batchCode, setBatchCode] = useState('');
    const [groupedStudents, setGroupedStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [batchCodes, setBatchCodes] = useState([]); // State for batch codes

    const token = localStorage.getItem('authToken'); // Get the token from local storage

    // Fetch batch codes when the component mounts
    useEffect(() => {
        const fetchBatchCodes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/faculty/getBatchCodes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBatchCodes(response.data.batchCodes);
            } catch (err) {
                setError('Error fetching batch codes');
            }
        };

        fetchBatchCodes();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/faculty/retrieveGroupedStudents', 
                { batchCode }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the authorization token
                    }
                }
            );
            setGroupedStudents(response.data.groupedStudents);
            setMessage('Grouped students retrieved successfully.');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching grouped students');
        }
    };

    return (
        <div className="get-grouped-students-container">
            <h2>Retrieve Grouped Students</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Batch Code:</label>
                    <select
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                        required
                    >
                        <option value="">Select Batch Code</option>
                        {batchCodes.map((code, index) => (
                            <option key={index} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn">Retrieve Grouped Students</button>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
            {groupedStudents.length > 0 && (
                <div className="students-table">
                    <h3>Grouped Students List</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Group ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedStudents.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.groupId ? student.groupId.groupId : 'N/A'}</td> {/* Assuming groupId has an _id property */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetGroupedStudents;
