import axios from 'axios';

export const BASE_URL = "https://thessinfo.pythonanywhere.com/";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
      // Ensures cookies are sent
});

export default api;