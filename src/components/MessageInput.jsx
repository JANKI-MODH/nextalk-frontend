import React, { useState, useRef, useEffect } from 'react';

/**
 * Message Input Component
 * Input bar for typing and sending messages
 * 
 * @param {Object} props
 * @param {Function} props.onSendMessage - Function to call when sending message
 * @param {Function} props.onTypingStart - Function to call when user starts typing
 * @param {Function} props.onTypingStop - Function to call when user stops typing
 * @param {boolean} props.disabled - Whether input is disabled
 */
const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled = false }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    
    /**
     * Handle typing detection
     * Triggers typing_start event when user starts typing
     * Triggers typing_stop after 1 second of no typing
     */
    const handleTyping = () => {
        if (!isTyping && !disabled) {
            setIsTyping(true);
            onTypingStart();
        }
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing after 1 second of no input
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                onTypingStop();
            }
        }, 1000);
    };
    
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        setMessage(e.target.value);
        handleTyping();
    };
    
    /**
     * Send message
     */
    const sendMessage = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            
            // Stop typing indicator after sending
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setIsTyping(false);
            onTypingStop();
        }
    };
    
    /**
     * Handle Enter key press
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);
    
    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-3">
                {/* Message Input Field */}
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder={disabled ? "Connecting..." : "Type a message..."}
                    disabled={disabled}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                
                {/* Send Button */}
                <button
                    onClick={sendMessage}
                    disabled={!message.trim() || disabled}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessageInput;