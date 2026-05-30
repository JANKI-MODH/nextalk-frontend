import React from 'react';

/**
 * Message Bubble Component
 * Displays a single message in a chat bubble
 * 
 * @param {Object} props
 * @param {Object} props.message - Message object
 * @param {boolean} props.isOwnMessage - Whether message is from current user
 */
const MessageBubble = ({ message, isOwnMessage }) => {
    
    /**
     * Format timestamp to readable time (e.g., "10:30 AM")
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted time
     */
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                
                {/* Sender Name (only for messages from others) */}
                {!isOwnMessage && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">
                        {message.sender_name || message.sender?.username}
                    </p>
                )}
                
                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-2 ${
                    isOwnMessage 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                    <p className="text-sm break-words">{message.message}</p>
                </div>
                
                {/* Timestamp */}
                <p className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.created_at)}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;