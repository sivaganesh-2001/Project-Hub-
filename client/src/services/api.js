import axios from 'axios';

// Set up the base URL for your API
const API_BASE_URL = 'http://localhost:5000/'; // Use HTTP for localhost or configure HTTPS if necessary

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optionally add request interceptors to include authentication tokens or other headers
api.interceptors.request.use(
    (config) => {
        // Example: Add an authorization token to the headers if available
        const token = localStorage.getItem('authToken'); // Adjust based on your auth mechanism
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optionally add response interceptors to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Example: Handle specific errors globally
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            console.error('Unauthorized access - redirecting to login');
        }
        return Promise.reject(error);
    }
);

export default api;
