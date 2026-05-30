import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/config';
import { getToken } from './authService';

let socket = null;

/**
 * Socket Service
 * Manages WebSocket connection for real-time communication
 * 
 * Events handled:
 * - connect: When socket connects
 * - disconnect: When socket disconnects
 * - receive_message: When new message arrives
 * - user_typing: When someone is typing
 * - user_joined_room: When user joins room
 * - user_left_room: When user leaves room
 * - user_offline: When user goes offline
 */

/**
 * Initialize socket connection
 * @returns {Object} - Socket instance
 */
export const initializeSocket = () => {
    const token = getToken();
    
    if (!token) {
        console.error('No token found. Cannot connect socket.');
        return null;
    }
    
    if (socket && socket.connected) {
        console.log('Socket already connected');
        return socket;
    }
    
    // Create new socket connection with auth token
    socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'], // Fallback if websocket fails
        reconnection: true, // Auto reconnect if disconnected
        reconnectionAttempts: 5, // Try 5 times
        reconnectionDelay: 1000, // Wait 1 second between attempts
    });
    
    // Connection event handlers
    socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
    });
    
    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });
    
    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
    });
    
    return socket;
};

/**
 * Get current socket instance
 * @returns {Object|null} - Socket instance or null
 */
export const getSocket = () => {
    if (!socket || !socket.connected) {
        console.warn('Socket not connected. Call initializeSocket first.');
        return null;
    }
    return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket disconnected manually');
    }
};

/**
 * Join a chat room
 * @param {number} roomId - Room ID to join
 */
export const joinRoom = (roomId) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('join_room', { roomId });
        console.log(`Joined room: ${roomId}`);
    }
};

/**
 * Leave a chat room
 * @param {number} roomId - Room ID to leave
 */
export const leaveRoom = (roomId) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('leave_room', { roomId });
        console.log(`Left room: ${roomId}`);
    }
};

/**
 * Send a message to a room
 * @param {number} roomId - Room ID
 * @param {string} message - Message content
 */
export const sendMessage = (roomId, message) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('send_message', { roomId, message });
    }
};

/**
 * Send typing indicator (user started typing)
 * @param {number} roomId - Room ID
 */
export const startTyping = (roomId) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('typing_start', { roomId });
    }
};

/**
 * Send typing indicator (user stopped typing)
 * @param {number} roomId - Room ID
 */
export const stopTyping = (roomId) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('typing_stop', { roomId });
    }
};

/**
 * Listen for new messages
 * @param {Function} callback - Function to call when message received
 * @returns {Function} - Unsubscribe function
 */
export const onReceiveMessage = (callback) => {
    const socket = getSocket();
    if (socket) {
        socket.on('receive_message', callback);
        return () => socket.off('receive_message', callback);
    }
    return () => {};
};

/**
 * Listen for typing indicators
 * @param {Function} callback - Function to call when typing status changes
 * @returns {Function} - Unsubscribe function
 */
export const onUserTyping = (callback) => {
    const socket = getSocket();
    if (socket) {
        socket.on('user_typing', callback);
        return () => socket.off('user_typing', callback);
    }
    return () => {};
};

/**
 * Listen for user joined room events
 * @param {Function} callback - Function to call when user joins
 * @returns {Function} - Unsubscribe function
 */
export const onUserJoined = (callback) => {
    const socket = getSocket();
    if (socket) {
        socket.on('user_joined_room', callback);
        return () => socket.off('user_joined_room', callback);
    }
    return () => {};
};

/**
 * Listen for user left room events
 * @param {Function} callback - Function to call when user leaves
 * @returns {Function} - Unsubscribe function
 */
export const onUserLeft = (callback) => {
    const socket = getSocket();
    if (socket) {
        socket.on('user_left_room', callback);
        return () => socket.off('user_left_room', callback);
    }
    return () => {};
};

/**
 * Listen for user offline events
 * @param {Function} callback - Function to call when user goes offline
 * @returns {Function} - Unsubscribe function
 */
export const onUserOffline = (callback) => {
    const socket = getSocket();
    if (socket) {
        socket.on('user_offline', callback);
        return () => socket.off('user_offline', callback);
    }
    return () => {};
};