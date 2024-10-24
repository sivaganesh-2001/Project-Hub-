// src/services/diaryService.js

export const fetchDiariesFromAPI = async () => {
    const response = await fetch('/api/diaries'); // Replace with your actual API endpoint
    if (!response.ok) {
        throw new Error('Failed to fetch diaries');
    }
    return await response.json();
};
