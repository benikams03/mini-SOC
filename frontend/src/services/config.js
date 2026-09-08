import axios from "axios";

export const api = axios.create({
    baseURL: 'https://mini-soc-oerx.onrender.com/api/v1',
    // baseURL: 'http://localhost:5050/api/v1',
    // timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});