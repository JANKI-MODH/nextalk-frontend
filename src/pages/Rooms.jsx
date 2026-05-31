import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllRooms, getMyRooms, createRoom, joinRoom } from '../services/roomService';

const Rooms = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    
    const [myRooms, setMyRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [activeTab, setActiveTab] = useState('my');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const loadRooms = async () => {
        setLoading(true);
        setError('');
        
        try {
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

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
            return;
        }
        loadRooms();
    }, [isAuthenticated, authLoading]);

    const handleCreateRoom = async (roomName) => {
        try {
            const response = await createRoom(roomName);
            if (response.success) {
                await loadRooms();
                setActiveTab('my');
                return true;
            }
            setError(response.message || 'Failed to create room');
            return false;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create room');
            return false;
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const response = await joinRoom(roomId);
            if (response.success) {
                await loadRooms();
            } else {
                setError(response.message || 'Failed to join room');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join room');
        }
    };

    const handleEnterRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    const getAvailableRooms = () => {
        const myRoomIds = new Set(myRooms.map(room => room.id));
        return allRooms.filter(room => !myRoomIds.has(room.id));
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-dark-100">
            
            {/* Desktop Sidebar */}
            <div className="hidden md:block h-full">
                <Sidebar />
            </div>
            
            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileSidebarOpen(false)}
                    ></div>
                    <div className="absolute left-0 top-0 bottom-0 w-64">
                        <Sidebar />
                    </div>
                </div>
            )}
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* Header */}
                <div className="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Chat Rooms</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Join a room to start chatting</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition"
                    >
                        <span>+</span>
                        <span>Create Room</span>
                    </button>
                </div>
                
                {/* Tab Navigation */}
                <div className="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-700 px-6 flex-shrink-0">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                                activeTab === 'my'
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            My Rooms ({myRooms.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                                activeTab === 'all'
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                        >
                            All Rooms ({getAvailableRooms().length})
                        </button>
                    </div>
                </div>
                
                {/* Error Display */}
                {error && (
                    <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex-shrink-0">
                        {error}
                    </div>
                )}
                
                {/* Rooms Grid - Scrollable area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'my' && (
                            myRooms.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-6xl mb-4">🏠</div>
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No rooms joined yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Browse available rooms to get started</p>
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Browse available rooms →
                                    </button>
                                </div>
                            ) : (
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
                        
                        {activeTab === 'all' && (
                            getAvailableRooms().length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">All caught up!</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">You've joined all available rooms</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Create a new room →
                                    </button>
                                </div>
                            ) : (
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
            </div>
            
            <CreateRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateRoom}
            />
        </div>
    );
};

export default Rooms;