import axios from 'axios';
import { API_URL } from '../utils/config';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const register = async (username, email, password) => {
    const response = await api.post('/auth/register', {
        username,
        email,
        password
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', {
        email,
        password
    });
    
    if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getToken();
};
