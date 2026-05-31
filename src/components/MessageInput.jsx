import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled = false }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    
    const handleTyping = () => {
        if (!isTyping && !disabled) {
            setIsTyping(true);
            onTypingStart();
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                onTypingStop();
            }
        }, 1000);
    };
    
    const handleChange = (e) => {
        setMessage(e.target.value);
        handleTyping();
    };
    
    const sendMessage = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setIsTyping(false);
            onTypingStop();
            setShowEmojiPicker(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    
    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
        inputRef.current?.focus();
    };
    
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);
    
    return (
        <div className="bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                    {/* Emoji Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-100 transition"
                            type="button"
                        >
                            😊
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full mb-2 left-0 z-20">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </div>
                    
                    {/* Message Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={disabled ? "Connecting..." : "Type a message..."}
                        disabled={disabled}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-100 dark:text-white disabled:opacity-50 transition"
                    />
                    
                    {/* Send Button - Icon only */}
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim() || disabled}
                        className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:from-primary-600 hover:to-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 flex items-center justify-center flex-shrink-0"
                        type="button"
                        aria-label="Send message"
                    >
                        <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};

export default MessageInput;