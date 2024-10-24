// services/studentService.js
import api from './api';

// Get a list of all students
export const getStudents = async () => {
    try {
        const response = await api.get('/students');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Get details of a specific student by ID
export const getStudentById = async (id) => {
    try {
        const response = await api.get(`/students/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student with ID ${id}:`, error);
        throw error;
    }
};

// Get a list of groups
export const getGroups = async () => {
    try {
        const response = await api.get('/groups');
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};

// Get a list of student submissions
export const getSubmissions = async () => {
    try {
        const response = await api.get('/submissions');
        return response.data;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
    }
};
