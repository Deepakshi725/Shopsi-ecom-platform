import axios from 'axios';
import { server } from './server';

const instance = axios.create({
    baseURL: server,
    withCredentials: true,            // crucial for sending cookies
});

// Add a request interceptor to add the token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;