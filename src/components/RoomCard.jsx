import React from 'react';

const RoomCard = ({ room, isJoined, onJoin, onEnter }) => {
    const memberCount = room.member_count || room.membercount || 0;
    
    // Get category badge color
    const getCategoryColor = (name) => {
        const categories = {
            'design': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'tech': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'marketing': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'social': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        };
        const key = Object.keys(categories).find(k => name?.toLowerCase().includes(k));
        return categories[key] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30`}>
                        <span className="text-2xl">💬</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{room.name}</h3>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
                {isJoined ? (
                    <button
                        onClick={() => onEnter(room.id)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
                    >
                        Enter Room →
                    </button>
                ) : (
                    <button
                        onClick={() => onJoin(room.id)}
                        className="px-4 py-2 border border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-sm font-medium"
                    >
                        Join Room +
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoomCard;