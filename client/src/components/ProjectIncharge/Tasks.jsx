import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ProjectIncharge/tasks.css';

const Tasks = () => {
    const [task, setTask] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadTask = async () => {
        const formData = new FormData();
        formData.append('task', task);
        if (file) formData.append('file', file);

        await axios.post('/api/tasks', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('Task assigned successfully!');
        setTask('');
        setFile(null);
    };

    return (
        <div>
            <h2>Tasks</h2>
            <input 
                type="text" 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                placeholder="Task description"
            />
            <input 
                type="file" 
                onChange={handleFileChange}
            />
            <button onClick={handleUploadTask}>Upload Task</button>
        </div>
    );
};

export default Tasks;
