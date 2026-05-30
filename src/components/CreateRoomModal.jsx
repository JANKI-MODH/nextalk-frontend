import React, { useState } from 'react';

/**
 * Create Room Modal Component
 * Popup dialog for creating new chat rooms
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Function to close modal
 * @param {Function} props.onCreate - Function to create room
 */
const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If modal is closed, don't render anything
    if (!isOpen) return null;

    /**
     * Handle form submission to create room
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate room name
        if (!roomName.trim()) {
            setError('Room name is required');
            return;
        }
        
        if (roomName.length < 3) {
            setError('Room name must be at least 3 characters');
            return;
        }
        
        setError('');
        setIsLoading(true);
        
        // Call the onCreate function passed from parent
        const success = await onCreate(roomName);
        
        setIsLoading(false);
        
        if (success) {
            // Clear form and close modal on success
            setRoomName('');
            onClose();
        }
    };

    return (
        // Modal Backdrop - Clicking outside closes modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            
            {/* Modal Container - Clicking inside doesn't close */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Create New Room</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Modal Body - Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Room Name
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="e.g., Gaming, Tech Talk, Movies"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1">
                            Create a space for people to chat about specific topics
                        </p>
                    </div>
                    
                    {/* Modal Footer - Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;