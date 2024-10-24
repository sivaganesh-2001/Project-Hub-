import React, { useEffect, useState } from 'react';
import { fetchTasksFromAPI } from '../../services/taskService'; // Adjust path if necessary
import '../../styles/ProjectGuide/tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const fetchedTasks = await fetchTasksFromAPI();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchTasks();
    }, []);

    return (
        <div className="tasks">
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <input type="file" />
                        <button>Submit Task</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
