import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
    if (typingUsers.length === 0) return null;
    
    const typingText = typingUsers.length === 1 
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.length} people are typing...`;
    
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-white dark:bg-dark-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{typingText}</span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;