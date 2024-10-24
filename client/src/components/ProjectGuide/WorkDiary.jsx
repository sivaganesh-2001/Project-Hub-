import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectGuide/WorkDiary.css'; // Ensure this CSS file is created

const WorkDiary = () => {
    const [workDiaries, setWorkDiaries] = useState([]); // Holds the list of work diaries
    const [loading, setLoading] = useState(true); // Shows loading state
    const [error, setError] = useState(null); // Handles errors
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Fetch work diaries when the component mounts
    useEffect(() => {
        const fetchWorkDiaries = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/faculty/getWorkDiary', {
                    headers: { 'Authorization': `Bearer ${token}` } // Add Bearer token here
                });
                const data = response.data;

                // Ensure the response is an array
                if (Array.isArray(data)) {
                    setWorkDiaries(data); // Set the work diaries data
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching work diaries');
            } finally {
                setLoading(false); // Stop the loading state
            }
        };

        fetchWorkDiaries();
    }, [token]);

    return (
        <div className="work-diary-container">
            <h1>Submitted Work Diaries</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            
            {/* Table for displaying work diaries */}
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Group Name</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Documents</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Check if workDiaries is an array and map over it */}
                    {Array.isArray(workDiaries) && workDiaries.length > 0 ? (
                        workDiaries.map((diary) => (
                            <tr key={diary._id}>
                                <td>{diary.studentId?.name || 'No Name'}</td>
                                <td>{diary.groupId?.groupId || 'No Group'}</td> {/* Adjust if necessary */}
                                <td>{new Date(diary.submissionDate).toLocaleDateString()}</td>
                                <td>{diary.status || 'No Status'}</td>
                                <td>{diary.notes || 'No Notes'}</td>
                                <td>
                                    {/* Link to view PDFs */}
                                    {diary.fileUrls && diary.fileUrls.map((fileUrl, index) => (
                                        <a 
                                            key={index} 
                                            href={`http://localhost:5000/${fileUrl}`} // Adjust URL according to your server setup
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            View PDF {index + 1}
                                        </a>
                                    ))}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No work diaries found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WorkDiary;
