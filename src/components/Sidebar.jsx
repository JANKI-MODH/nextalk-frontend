import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { icon: '💬', label: 'Rooms', path: '/rooms' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        // Fixed: h-full and relative positioning
        <div className="h-full w-64 bg-white dark:bg-dark-200 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                    </div>
                    <div>
                        <span className="font-bold text-lg text-gray-800 dark:text-white">NexTalk</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Real-time Chat</p>
                    </div>
                </div>
            </div>

            {/* Navigation - flex-1 to take remaining space */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            isActive(item.path)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Section - flex-shrink-0 to stay at bottom */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-100 transition flex-shrink-0"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
                
                <button
                    onClick={logout}
                    className="w-full mt-2 text-left text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 rounded-lg transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;