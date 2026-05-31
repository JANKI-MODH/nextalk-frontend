import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
    const navigate = useNavigate();
    const { login, error, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationError) setValidationError('');
    };

    const validateForm = () => {
        const { email, password } = formData;
        if (!email.trim()) {
            setValidationError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address');
            return false;
        }
        if (!password.trim()) {
            setValidationError('Password is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const success = await login(formData.email, formData.password);
        if (success) {
            navigate('/rooms');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-300 dark:via-dark-200 dark:to-dark-100 flex items-center justify-center p-4">
            
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-dark-200 shadow-lg z-50"
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
                        <span className="text-2xl font-bold text-white">N</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NexTalk</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time chat application</p>
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Welcome back</h2>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-200 dark:text-white transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-200 dark:text-white transition"
                        />
                    </div>

                    {(validationError || error) && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
                            {validationError || error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                            Create an account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                    <p>© 2024 NexTalk. All rights reserved.</p>
                </div>
            </div>

            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Login;