import React from 'react';

/**
 * Typing Indicator Component
 * Shows animated dots when someone is typing
 * 
 * @param {Object} props
 * @param {Array} props.typingUsers - List of users currently typing
 */
const TypingIndicator = ({ typingUsers }) => {
    if (typingUsers.length === 0) return null;
    
    // Get the first typing user's name
    const typingUser = typingUsers[0];
    const typingText = typingUsers.length === 1 
        ? `${typingUser} is typing...`
        : `${typingUsers.length} people are typing...`;
    
    return (
        <div className="px-4 py-2">
            <div className="flex items-center space-x-2">
                {/* Animated dots */}
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-sm text-gray-500">{typingText}</p>
            </div>
        </div>
    );
};

export default TypingIndicator;