import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:5050/api/v1',
    // timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// api.interceptors.request.use(async (config) => {
//     const token = null
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });