import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/RetrieveUngroupedStudents.css';

const UngroupedStudents = () => {
    const [batchCode, setBatchCode] = useState('');
    const [ungroupedStudents, setUngroupedStudents] = useState([]);
    const [batchCodes, setBatchCodes] = useState([]); // State to hold batch codes
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

    // Fetch batch codes when the component mounts
    useEffect(() => {
        const fetchBatchCodes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/faculty/getBatchCodes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
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
                'http://localhost:5000/api/faculty/retrieveUngroupedStudents',
                { batchCode },  // Sending batchCode in the body
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the headers
                        'Content-Type': 'application/json' // Ensure JSON content type
                    }
                }
            );
            setUngroupedStudents(response.data.ungroupedStudents);
            setMessage('Ungrouped students retrieved successfully.');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setUngroupedStudents([]); // Clear previous results on error
        }
    };

    return (
        <div className="get-ungrouped-students-container">
            <h2>Retrieve Ungrouped Students</h2>
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
            {ungroupedStudents.length > 0 && (
                <div className="students-table">
                    <h3>Ungrouped Students:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ungroupedStudents.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
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

export default UngroupedStudents;
