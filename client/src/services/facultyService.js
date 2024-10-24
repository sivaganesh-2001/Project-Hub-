// services/facultyService.js
import api from './api';

// Get a list of all faculty members
export const getFaculties = async () => {
    try {
        const response = await api.get('/faculties');
        return response.data;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        throw error;
    }
};

// Get details of a specific faculty member by ID
export const getFacultyById = async (id) => {
    try {
        const response = await api.get(`/faculties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching faculty with ID ${id}:`, error);
        throw error;
    }
};

// Create a new faculty member
export const createFaculty = async (facultyData) => {
    try {
        const response = await api.post('/faculties', facultyData);
        return response.data;
    } catch (error) {
        console.error('Error creating faculty:', error);
        throw error;
    }
};

// Update an existing faculty member
export const updateFaculty = async (id, facultyData) => {
    try {
        const response = await api.put(`/faculties/${id}`, facultyData);
        return response.data;
    } catch (error) {
        console.error(`Error updating faculty with ID ${id}:`, error);
        throw error;
    }
};

// Remove a faculty member
export const removeFaculty = async (id) => {
    try {
        const response = await api.delete(`/faculties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing faculty with ID ${id}:`, error);
        throw error;
    }
};

// Get a list of guides
export const getGuides = async () => {
    try {
        const response = await api.get('/guides');
        return response.data;
    } catch (error) {
        console.error('Error fetching guides:', error);
        throw error;
    }
};
