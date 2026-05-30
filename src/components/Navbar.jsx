import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation Bar Component
 * Appears at the top of all pages after login
 * 
 * Features:
 * - Shows logged-in user's name
 * - Logout button
 * - App logo/title
 */
const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    /**
     * Handle logout
     * 1. Call logout function from auth context
     * 2. Redirect to login page
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo / Brand Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                NexTalk
                            </h1>
                        </div>
                    </div>
                    
                    {/* User Info & Logout Section */}
                    <div className="flex items-center space-x-4">
                        {/* User Avatar/Icon */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-gray-700 font-medium">
                                {user?.username}
                            </span>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;