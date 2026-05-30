import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRoomMessages } from '../services/messageService';
import { getRoomById } from '../services/roomService';
import {
    initializeSocket,
    getSocket,
    disconnectSocket,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    onReceiveMessage,
    onUserTyping,
    onUserJoined,
    onUserLeft,
    onUserOffline
} from '../services/socketService';

/**
 * Chat Page Component
 * Real-time chat interface for a specific room
 * 
 * Features:
 * - Load message history
 * - Send/receive messages in real-time
 * - Typing indicators
 * - User join/leave notifications
 * - Auto-scroll to bottom
 */
const Chat = () => {
    const { roomId } = useParams(); // Get room ID from URL
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // State variables
    const [room, setRoom] = useState(null);          // Room details
    const [messages, setMessages] = useState([]);    // List of messages
    const [typingUsers, setTypingUsers] = useState([]); // Users currently typing
    const [loading, setLoading] = useState(true);     // Loading state
    const [socketReady, setSocketReady] = useState(false); // Socket connection status
    
    // Ref for auto-scrolling to bottom
    const messagesEndRef = useRef(null);
    // Ref to track typing timeout
    const typingTimeoutRef = useRef(null);
    
    // ============================================================
    // SCROLL TO BOTTOM
    // ============================================================
    /**
     * Auto-scroll to bottom when new messages arrive
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // ============================================================
    // LOAD ROOM DETAILS AND MESSAGES
    // ============================================================
    /**
     * Fetch room details and message history from backend
     */
    const loadRoomData = async () => {
        try {
            // Fetch room details
            const roomRes = await getRoomById(roomId);
            if (roomRes.success) {
                setRoom(roomRes.room);
            } else {
                console.error('Room not found');
                navigate('/rooms');
                return;
            }
            
            // Fetch message history
            const messagesRes = await getRoomMessages(roomId);
            if (messagesRes.success) {
                setMessages(messagesRes.messages || []);
            }
        } catch (error) {
            console.error('Failed to load room data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // ============================================================
    // SOCKET SETUP
    // ============================================================
    /**
     * Initialize socket and set up event listeners
     */
    useEffect(() => {
        // Load room data first
        loadRoomData();
        
        // Initialize socket connection
        const socket = initializeSocket();
        
        // Wait for socket to connect
        const checkSocketConnection = setInterval(() => {
            const currentSocket = getSocket();
            if (currentSocket && currentSocket.connected) {
                setSocketReady(true);
                clearInterval(checkSocketConnection);
                
                // Join the room
                joinRoom(roomId);
            }
        }, 500);
        
        // Cleanup on component unmount
        return () => {
            clearInterval(checkSocketConnection);
            if (getSocket()) {
                leaveRoom(roomId);
            }
        };
    }, [roomId]);
    
    // ============================================================
    // SOCKET EVENT LISTENERS
    // ============================================================
    useEffect(() => {
        if (!socketReady) return;
        
        // Listen for new messages
        const unsubscribeReceiveMessage = onReceiveMessage((messageData) => {
            console.log('New message received:', messageData);
            setMessages(prev => [...prev, messageData]);
        });
        
        // Listen for typing indicators
        const unsubscribeTyping = onUserTyping(({ userId, username, isTyping }) => {
            if (userId === user?.id) return; // Ignore own typing
            
            setTypingUsers(prev => {
                if (isTyping) {
                    // Add user if not already in list
                    if (!prev.includes(username)) {
                        return [...prev, username];
                    }
                } else {
                    // Remove user from list
                    return prev.filter(name => name !== username);
                }
                return prev;
            });
        });
        
        // Listen for user join notifications
        const unsubscribeJoin = onUserJoined(({ userId, username, message }) => {
            console.log('User joined:', username);
            // Add system message
            setMessages(prev => [...prev, {
                id: Date.now(),
                isSystem: true,
                message: message,
                created_at: new Date().toISOString()
            }]);
        });
        
        // Listen for user leave notifications
        const unsubscribeLeave = onUserLeft(({ userId, username, message }) => {
            console.log('User left:', username);
            setMessages(prev => [...prev, {
                id: Date.now(),
                isSystem: true,
                message: message,
                created_at: new Date().toISOString()
            }]);
        });
        
        // Listen for user offline notifications
        const unsubscribeOffline = onUserOffline(({ userId, username, message }) => {
            console.log('User offline:', username);
            setMessages(prev => [...prev, {
                id: Date.now(),
                isSystem: true,
                message: message,
                created_at: new Date().toISOString()
            }]);
        });
        
        // Cleanup listeners on unmount or when socket becomes unavailable
        return () => {
            unsubscribeReceiveMessage();
            unsubscribeTyping();
            unsubscribeJoin();
            unsubscribeLeave();
            unsubscribeOffline();
        };
    }, [socketReady, roomId, user?.id]);
    
    // ============================================================
    // MESSAGE HANDLERS
    // ============================================================
    /**
     * Send a message to the room
     * @param {string} message - Message content
     */
    const handleSendMessage = (message) => {
        sendMessage(roomId, message);
    };
    
    /**
     * Handle typing start
     */
    const handleTypingStart = () => {
        startTyping(roomId);
    };
    
    /**
     * Handle typing stop
     */
    const handleTypingStop = () => {
        stopTyping(roomId);
    };
    
    // Show loading spinner while loading
    if (loading) {
        return <LoadingSpinner />;
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar */}
            <Navbar />
            
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/rooms')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back to Rooms
                        </button>
                        
                        {/* Room Name */}
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{room?.name}</h1>
                            <p className="text-sm text-gray-500">
                                {messages.filter(m => !m.isSystem).length} messages
                            </p>
                        </div>
                    </div>
                    
                    {/* Online Status Indicator */}
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${socketReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {socketReady ? 'Connected' : 'Connecting...'}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
                {messages.length === 0 ? (
                    // Empty state - No messages yet
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Be the first to send a message!</p>
                    </div>
                ) : (
                    // Display all messages
                    messages.map((msg, index) => (
                        msg.isSystem ? (
                            // System message (join/leave notifications)
                            <div key={index} className="text-center my-2">
                                <p className="text-xs text-gray-400">{msg.message}</p>
                            </div>
                        ) : (
                            // Regular user message
                            <MessageBubble
                                key={msg.id || index}
                                message={msg}
                                isOwnMessage={msg.sender_id === user?.id || msg.sender?.id === user?.id}
                            />
                        )
                    ))
                )}
                
                {/* Typing Indicator */}
                <TypingIndicator typingUsers={typingUsers} />
                
                {/* Invisible div for auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                disabled={!socketReady}
            />
        </div>
    );
};

export default Chat;