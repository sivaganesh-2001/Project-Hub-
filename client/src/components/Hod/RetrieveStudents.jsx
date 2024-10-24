import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/RetriveStudents.css';

const GetStudents = () => {
    const [deptId, setDeptId] = useState('');
    const [batchCode, setBatchCode] = useState('');
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');

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
                    <label>Department ID:</label>
                    <input
                        type="text"
                        value={deptId}
                        onChange={(e) => setDeptId(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Batch Code:</label>
                    <input
                        type="text"
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn">Retrieve Students</button>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>

            {students.length > 0 && (
                <div className="students-list">
                    <h3>Students List</h3>
                    <ul>
                        {students.map((student) => (
                            <li key={student._id}>
                                <strong>Name:</strong> {student.name}<br />
                                <strong>Roll No:</strong> {student.rollNo}<br />
                                <strong>Email:</strong> {student.email}<br />
                                <strong>Batch Code:</strong> {student.batchCode?.batchCode}<br />
                                <strong>Group:</strong> {student.groupId ? student.groupId.groupName : 'No group'}<br />
                                <strong>Tasks:</strong>
                                <ul>
                                    {student.tasks.map(task => (
                                        <li key={task.taskId._id}>{task.taskId.taskName} - {task.status}</li>
                                    ))}
                                </ul>
                                <strong>Work Diaries:</strong>
                                <ul>
                                    {student.workDiaries.map(diary => (
                                        <li key={diary.diaryId._id}>{diary.diaryId.diaryTitle} - {diary.status}</li>
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

export default GetStudents;
