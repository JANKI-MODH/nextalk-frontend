import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRoomMessages } from '../services/messageService';
import { getRoomById } from '../services/roomService';
import {
    initializeSocket,
    getSocket,
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

const Chat = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socketReady, setSocketReady] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    
    const sortMessagesByDate = (messagesArray) => {
        if (!messagesArray || messagesArray.length === 0) return [];
        return [...messagesArray].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMore) return;
        
        setIsLoadingMore(true);
        
        try {
            const nextPage = currentPage + 1;
            const response = await getRoomMessages(roomId, nextPage, 50);
            
            if (response.success && response.messages && response.messages.length > 0) {
                const container = messagesContainerRef.current;
                const oldScrollHeight = container?.scrollHeight || 0;
                
                const formattedMessages = response.messages.map(msg => ({
                    ...msg,
                    created_at: msg.created_at || msg.createdAt || new Date().toISOString()
                }));
                
                setMessages(prev => {
                    const allMessages = [...formattedMessages, ...prev];
                    return sortMessagesByDate(allMessages);
                });
                setCurrentPage(nextPage);
                
                if (response.messages.length < 50) {
                    setHasMore(false);
                }
                
                requestAnimationFrame(() => {
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        container.scrollTop = newScrollHeight - oldScrollHeight;
                    }
                });
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more messages:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };
    
    const handleScroll = useCallback(async () => {
        if (!messagesContainerRef.current) return;
        
        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop < 100 && hasMore && !isLoadingMore && messages.length > 0) {
            await loadMoreMessages();
        }
    }, [hasMore, isLoadingMore, messages.length]);
    
    const loadInitialMessages = async () => {
        try {
            const response = await getRoomMessages(roomId, 1, 50);
            
            if (response.success && response.messages) {
                const formattedMessages = response.messages.map(msg => ({
                    ...msg,
                    created_at: msg.created_at || msg.createdAt || new Date().toISOString()
                }));
                setMessages(sortMessagesByDate(formattedMessages));
                
                if (response.messages.length < 50) {
                    setHasMore(false);
                }
                
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };
    
    const loadRoomData = async () => {
        try {
            const roomRes = await getRoomById(roomId);
            if (roomRes.success) {
                setRoom(roomRes.room);
            } else {
                navigate('/rooms');
                return;
            }
            await loadInitialMessages();
        } catch (error) {
            console.error('Failed to load room data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadRoomData();
        
        const socket = initializeSocket();
        
        const checkSocketConnection = setInterval(() => {
            const currentSocket = getSocket();
            if (currentSocket && currentSocket.connected) {
                setSocketReady(true);
                clearInterval(checkSocketConnection);
                joinRoom(roomId);
            }
        }, 500);
        
        return () => {
            clearInterval(checkSocketConnection);
            if (getSocket()) {
                leaveRoom(roomId);
            }
        };
    }, [roomId]);
    
    useEffect(() => {
        if (!socketReady) return;
        
        const unsubscribeReceiveMessage = onReceiveMessage((messageData) => {
            const formattedMessage = {
                ...messageData,
                created_at: messageData.created_at || messageData.createdAt || new Date().toISOString(),
                sender_id: messageData.sender_id || messageData.sender?.id,
                sender_name: messageData.sender_name || messageData.sender?.username
            };
            
            setMessages(prev => {
                const allMessages = [...prev, formattedMessage];
                return sortMessagesByDate(allMessages);
            });
            setTimeout(scrollToBottom, 100);
        });
        
        const unsubscribeTyping = onUserTyping(({ userId, username, isTyping }) => {
            if (userId === user?.id) return;
            setTypingUsers(prev => {
                if (isTyping) {
                    if (!prev.includes(username)) return [...prev, username];
                } else {
                    return prev.filter(name => name !== username);
                }
                return prev;
            });
        });
        
        const unsubscribeJoin = onUserJoined(({ username, message }) => {
            setMessages(prev => {
                const systemMessage = {
                    id: Date.now(),
                    isSystem: true,
                    message: message,
                    created_at: new Date().toISOString()
                };
                return sortMessagesByDate([...prev, systemMessage]);
            });
            setTimeout(scrollToBottom, 100);
        });
        
        const unsubscribeLeave = onUserLeft(({ username, message }) => {
            setMessages(prev => {
                const systemMessage = {
                    id: Date.now(),
                    isSystem: true,
                    message: message,
                    created_at: new Date().toISOString()
                };
                return sortMessagesByDate([...prev, systemMessage]);
            });
            setTimeout(scrollToBottom, 100);
        });
        
        const unsubscribeOffline = onUserOffline(({ username, message }) => {
            setMessages(prev => {
                const systemMessage = {
                    id: Date.now(),
                    isSystem: true,
                    message: message,
                    created_at: new Date().toISOString()
                };
                return sortMessagesByDate([...prev, systemMessage]);
            });
            setTimeout(scrollToBottom, 100);
        });
        
        return () => {
            unsubscribeReceiveMessage();
            unsubscribeTyping();
            unsubscribeJoin();
            unsubscribeLeave();
            unsubscribeOffline();
        };
    }, [socketReady, user?.id]);
    
    const handleSendMessage = (message) => {
        if (message.trim() && socketReady) {
            sendMessage(roomId, message.trim());
        }
    };
    
    const handleTypingStart = () => startTyping(roomId);
    const handleTypingStop = () => stopTyping(roomId);
    
    if (loading) {
        return <LoadingSpinner />;
    }
    
    return (
        // Main container - full height, no overflow on container
        <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-dark-100">
            
            {/* Desktop Sidebar - hidden on mobile, block on desktop */}
            <div className="hidden md:block h-full">
                <Sidebar />
            </div>
            
            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileSidebarOpen(false)}
                    ></div>
                    <div className="absolute left-0 top-0 bottom-0 w-64">
                        <Sidebar />
                    </div>
                </div>
            )}
            
            {/* Chat Area - takes remaining space */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* Chat Header */}
                <div className="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">{room?.name}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {messages.filter(m => !m.isSystem).length} messages • {socketReady ? 'Connected' : 'Connecting...'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${socketReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                            {socketReady ? 'Live' : 'Offline'}
                        </span>
                    </div>
                </div>
                
                {/* Messages Area - flex-1 to take remaining space, overflow-y-auto for scrolling */}
                <div 
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4"
                >
                    <div className="max-w-3xl mx-auto">
                        {isLoadingMore && (
                            <div className="text-center py-2">
                                <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-dark-200 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    <span className="text-xs text-gray-500">Loading older messages...</span>
                                </div>
                            </div>
                        )}
                        
                        {!hasMore && messages.length > 0 && (
                            <div className="text-center py-2">
                                <p className="text-xs text-gray-400">✨ Beginning of conversation ✨</p>
                            </div>
                        )}
                        
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No messages yet</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Be the first to send a message!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                msg.isSystem ? (
                                    <div key={index} className="text-center my-3">
                                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-dark-200 px-3 py-1 rounded-full">
                                            {msg.message}
                                        </span>
                                    </div>
                                ) : (
                                    <MessageBubble
                                        key={msg.id || index}
                                        message={msg}
                                        isOwnMessage={msg.sender_id === user?.id || msg.sender?.id === user?.id}
                                    />
                                )
                            ))
                        )}
                        
                        <TypingIndicator typingUsers={typingUsers} />
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                {/* Message Input - flex-shrink-0 to stay at bottom */}
                <div className="flex-shrink-0">
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        onTypingStart={handleTypingStart}
                        onTypingStop={handleTypingStop}
                        disabled={!socketReady}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chat;