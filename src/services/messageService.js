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
 * Get messages for a room
 * @param {number} roomId - Room ID
 * @param {number} limit - Number of messages to fetch
 * @returns {Promise} - List of messages
 */
export const getRoomMessages = async (roomId, limit = 50) => {
    const response = await api.get(`/messages/room/${roomId}?limit=${limit}`);
    return response.data;
};

/**
 * Send a message (HTTP fallback, use socket for real-time)
 * @param {number} roomId - Room ID
 * @param {string} message - Message content
 * @returns {Promise} - Sent message data
 */
export const sendMessageHTTP = async (roomId, message) => {
    const response = await api.post('/messages', { roomId, message });
    return response.data;
};