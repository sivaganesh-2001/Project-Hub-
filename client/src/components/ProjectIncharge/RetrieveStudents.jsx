import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/RetriveStudents.css';

const GetStudents = () => {
    const [deptId, setDeptId] = useState('');
    const [batchCode, setBatchCode] = useState('');
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [batchCodes, setBatchCodes] = useState([]);

    const token = localStorage.getItem('authToken');

    // Fetch batch codes when component mounts
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
                'http://localhost:5000/api/faculty/retrieveStudents', 
                { deptId, batchCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setStudents(response.data.students);
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching students');
        }
    };

    return (
        <div className="get-students-container">
            <h2>Retrieve Students</h2>
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
                <button type="submit" className="btn">Retrieve Students</button>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>

            {students.length > 0 && (
                <div className="students-table">
                    <h3>Students List</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.rollNo}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetStudents;
