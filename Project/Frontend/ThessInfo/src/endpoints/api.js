import axios from 'axios';

// Read the base URL from the environment (Vite injects import.meta.env)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://thessinfo.pythonanywhere.com/';

// Create an axios instance using the env‐provided baseURL
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Ensures cookies are sent
});

export default api;