import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import { getAllRooms, getMyRooms, createRoom, joinRoom } from '../services/roomService';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Rooms Page Component
 * Main dashboard where users can view and join rooms
 * 
 * Features:
 * - Toggle between My Rooms and All Rooms
 * - Create new rooms
 * - Join existing rooms
 * - Enter rooms to start chatting
 */
const Rooms = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    
    // State variables
    const [myRooms, setMyRooms] = useState([]);        // Rooms user has joined
    const [allRooms, setAllRooms] = useState([]);      // All available rooms
    const [activeTab, setActiveTab] = useState('my');   // 'my' or 'all' tab
    const [loading, setLoading] = useState(true);       // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Create room modal
    const [error, setError] = useState('');              // Error message

    // ============================================================
    // LOAD ROOMS DATA
    // ============================================================
    /**
     * Fetch both user's rooms and all rooms from backend
     */
    const loadRooms = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Fetch both APIs in parallel for better performance
            const [myRoomsRes, allRoomsRes] = await Promise.all([
                getMyRooms(),
                getAllRooms()
            ]);
            
            if (myRoomsRes.success) {
                setMyRooms(myRoomsRes.rooms || []);
            }
            
            if (allRoomsRes.success) {
                setAllRooms(allRoomsRes.rooms || []);
            }
        } catch (err) {
            console.error('Failed to load rooms:', err);
            setError('Failed to load rooms. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Load rooms when component mounts
    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
            return;
        }
        loadRooms();
    }, [isAuthenticated, authLoading]);

    // ============================================================
    // ROOM ACTIONS
    // ============================================================
    /**
     * Create a new room
     * @param {string} roomName - Name of the room to create
     * @returns {boolean} - Success status
     */
    const handleCreateRoom = async (roomName) => {
        try {
            const response = await createRoom(roomName);
            
            if (response.success) {
                // Refresh the rooms list
                await loadRooms();
                // Switch to My Rooms tab to show newly created room
                setActiveTab('my');
                return true;
            } else {
                setError(response.message || 'Failed to create room');
                return false;
            }
        } catch (err) {
            console.error('Create room error:', err);
            setError(err.response?.data?.message || 'Failed to create room');
            return false;
        }
    };

    /**
     * Join an existing room
     * @param {number} roomId - ID of the room to join
     */
    const handleJoinRoom = async (roomId) => {
        try {
            const response = await joinRoom(roomId);
            
            if (response.success) {
                // Refresh rooms list to update UI
                await loadRooms();
                // Optional: Auto-enter the room after joining
                // navigate(`/chat/${roomId}`);
            } else {
                setError(response.message || 'Failed to join room');
            }
        } catch (err) {
            console.error('Join room error:', err);
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    /**
     * Enter a room to start chatting
     * @param {number} roomId - ID of the room to enter
     */
    const handleEnterRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    // ============================================================
    // FILTER ROOMS FOR DISPLAY
    // ============================================================
    /**
     * Get rooms that user hasn't joined yet (for All Rooms tab)
     */
    const getAvailableRooms = () => {
        const myRoomIds = new Set(myRooms.map(room => room.id));
        return allRooms.filter(room => !myRoomIds.has(room.id));
    };

    // Show loading spinner while checking auth or loading rooms
    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <Navbar />
            
            {/* Main Content Container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section with Title and Create Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Chat Rooms</h1>
                        <p className="text-gray-500 mt-1">Join a room to start chatting</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        <span>+</span>
                        <span>Create Room</span>
                    </button>
                </div>
                
                {/* Error Message Display */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                
                {/* Tab Navigation - My Rooms / All Rooms */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                                activeTab === 'my'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            My Rooms ({myRooms.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                                activeTab === 'all'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All Rooms ({getAvailableRooms().length})
                        </button>
                    </nav>
                </div>
                
                {/* Rooms Grid - Shows rooms in a responsive grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* MY ROOMS TAB CONTENT */}
                    {activeTab === 'my' && (
                        myRooms.length === 0 ? (
                            // Empty state - No rooms joined
                            <div className="col-span-full text-center py-12">
                                <div className="text-6xl mb-4">🏠</div>
                                <p className="text-gray-500 mb-2">You haven't joined any rooms yet</p>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Browse available rooms →
                                </button>
                            </div>
                        ) : (
                            // Display user's joined rooms
                            myRooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    isJoined={true}
                                    onJoin={handleJoinRoom}
                                    onEnter={handleEnterRoom}
                                />
                            ))
                        )
                    )}
                    
                    {/* ALL ROOMS TAB CONTENT */}
                    {activeTab === 'all' && (
                        getAvailableRooms().length === 0 ? (
                            // Empty state - No rooms available to join
                            <div className="col-span-full text-center py-12">
                                <div className="text-6xl mb-4">🎉</div>
                                <p className="text-gray-500 mb-2">You've joined all available rooms!</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Create a new room →
                                </button>
                            </div>
                        ) : (
                            // Display rooms available to join
                            getAvailableRooms().map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    isJoined={false}
                                    onJoin={handleJoinRoom}
                                    onEnter={handleEnterRoom}
                                />
                            ))
                        )
                    )}
                </div>
            </div>
            
            {/* Create Room Modal */}
            <CreateRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateRoom}
            />
        </div>
    );
};

export default Rooms;