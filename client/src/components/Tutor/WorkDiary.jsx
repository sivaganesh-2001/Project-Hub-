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
                setError('');
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
            {!loading && workDiaries.length === 0 && <p>No work diaries currently.</p>} {/* Display message if no work diaries */}
            {error && <p className="error">{error}</p>}
            
            {/* Table for displaying work diaries */}
            {workDiaries.length > 0 && (
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
                        {workDiaries.map((diary) => (
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
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WorkDiary;
