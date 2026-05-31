import React from 'react';
import { useAuth } from '../context/AuthContext';

const MessageBubble = ({ message, isOwnMessage }) => {
    const { user } = useAuth();
    
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Just now';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Just now';
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (date.toDateString() === today.toDateString()) {
                return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
            if (date.toDateString() === yesterday.toDateString()) {
                return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
            return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            return 'Just now';
        }
    };
    
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                {!isOwnMessage && (
                    <div className="flex items-center gap-2 mb-1 ml-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                {message.sender_name?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {message.sender_name || message.sender?.username}
                        </p>
                    </div>
                )}
                
                <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                    isOwnMessage 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-dark-200 text-gray-800 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700'
                }`}>
                    <p className="text-sm break-words">{message.message}</p>
                </div>
                
                <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-xs text-gray-400">
                        {formatDateTime(message.created_at)}
                    </p>
                    {isOwnMessage && (
                        <svg className="w-3 h-3 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;