import React from 'react';

/**
 * Room Card Component
 * Displays a single room in a beautiful card format
 * 
 * @param {Object} props
 * @param {Object} props.room - Room object containing id, name, member_count
 * @param {boolean} props.isJoined - Whether user has joined this room
 * @param {Function} props.onJoin - Function to call when Join button is clicked
 * @param {Function} props.onEnter - Function to call when Enter button is clicked
 */
const RoomCard = ({ room, isJoined, onJoin, onEnter }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100">
            
            {/* Room Icon and Name Section */}
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    {/* Room Icon - Different colors based on member count */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        room.member_count > 10 ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                        <span className="text-xl">
                            {room.member_count > 10 ? '🔥' : '💬'}
                        </span>
                    </div>
                    
                    {/* Room Details */}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                            {room.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {room.member_count || 0} member{room.member_count !== 1 ? 's' : ''}
                        </p>
                        {room.creator_name && (
                            <p className="text-xs text-gray-400">
                                Created by {room.creator_name}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className="mt-4 flex justify-end">
                {isJoined ? (
                    // If user is already in room, show Enter button
                    <button
                        onClick={() => onEnter(room.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-sm font-medium"
                    >
                        Enter Room →
                    </button>
                ) : (
                    // If user is not in room, show Join button
                    <button
                        onClick={() => onJoin(room.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm font-medium"
                    >
                        Join Room +
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoomCard;