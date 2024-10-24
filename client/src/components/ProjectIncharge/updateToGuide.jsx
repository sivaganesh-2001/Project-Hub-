import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/updateToGuide.css';

const UpdateToGuide = () => {
    const [email, setEmail] = useState('');
    const [batchCode, setBatchCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(''); // Add your token handling logic here

    const newRole = 'projectGuide'; // Default role

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Create a new FormData instance
            const formData = new FormData();
            formData.append('email', email);
            formData.append('newRole', newRole);
            formData.append('batchCode', batchCode);
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            const response = await axios.put(
                'http://localhost:5000/api/faculty/updateToGuide',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include Bearer token for authorization
                        'Content-Type': 'application/json' // Set the content type to multipart/form-data
                    }
                }
            );
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <div className="update-to-guide-container">
            <h2>Update Faculty to Project Guide</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Batch Code:</label>
                    <input
                        type="text"
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Update to Guide</button>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default UpdateToGuide;
