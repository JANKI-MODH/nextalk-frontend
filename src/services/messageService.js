import axios from 'axios';
import { API_URL } from '../utils/config';
import { getToken } from './authService';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Get messages for a room with pagination
 * @param {number} roomId - Room ID
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of messages per page
 * @returns {Promise} - List of messages (oldest to newest)
 */
export const getRoomMessages = async (roomId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/room/${roomId}`, {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Send a message (HTTP fallback, use socket for real-time)
 */
export const sendMessageHTTP = async (roomId, message) => {
    const response = await api.post('/messages', { roomId, message });
    return response.data;
};