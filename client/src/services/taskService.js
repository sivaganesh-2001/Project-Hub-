// src/services/taskService.js

export const fetchTasksFromAPI = async () => {
    const response = await fetch('/api/tasks'); // Replace with your actual API endpoint
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return await response.json();
};
