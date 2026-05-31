import axios from 'axios';
import { API_URL } from '../utils/config';
import { getToken } from './authService';

// Create axios instance with auth header
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
 * Create a new room
 * @param {string} name - Room name
 * @returns {Promise} - Created room data
 */
export const createRoom = async (name) => {
    const response = await api.post('/rooms', { name });
    return response.data;
};

/**
 * Get all rooms
 * @returns {Promise} - List of all rooms
 */
export const getAllRooms = async () => {
    const response = await api.get('/rooms');
    // Ensure each room has member_count
    if (response.data.rooms) {
        response.data.rooms = response.data.rooms.map(room => ({
            ...room,
            member_count: room.member_count || room.membercount || 0
        }));
    }
    return response.data;
};

/**
 * Get rooms joined by current user
 * @returns {Promise} - List of user's rooms
 */
export const getMyRooms = async () => {
    const response = await api.get('/rooms/my/rooms');
    if (response.data.rooms) {
        response.data.rooms = response.data.rooms.map(room => ({
            ...room,
            member_count: room.member_count || room.membercount || 0
        }));
    }
    return response.data;
};

/**
 * Get single room by ID
 * @param {number} roomId - Room ID
 * @returns {Promise} - Room details
 */
export const getRoomById = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
};

/**
 * Join a room
 * @param {number} roomId - Room ID
 * @returns {Promise} - Join response
 */
export const joinRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/join`);
    return response.data;
};