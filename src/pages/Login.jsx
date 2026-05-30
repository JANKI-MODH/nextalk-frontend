import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Login Page Component
 * Allows existing users to authenticate and access the app
 * 
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Error handling
 * - Loading state
 * - Navigation to register page
 */
const Login = () => {
    // ============================================================
    // STATE VARIABLES
    // ============================================================
    // useNavigate: Hook to programmatically redirect to other pages
    const navigate = useNavigate();
    
    // useAuth: Custom hook to access authentication functions from context
    const { login, error, loading } = useAuth();
    
    // Form data state - stores what user types in inputs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    // Local error state for validation (before API call)
    const [validationError, setValidationError] = useState('');

    // ============================================================
    // HANDLE INPUT CHANGE
    // ============================================================
    /**
     * Updates form data state when user types in any input field
     * @param {Event} e - Input change event
     * 
     * HOW IT WORKS:
     * 1. Get input name (email or password) and value
     * 2. Update only that field in formData state
     * 3. Clear validation errors when user starts typing again
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (validationError) setValidationError('');
    };

    // ============================================================
    // FORM VALIDATION
    // ============================================================
    /**
     * Validates form data before sending to backend
     * @returns {boolean} - True if valid, false if invalid
     * 
     * Validation rules:
     * 1. Email must not be empty
     * 2. Email must contain @ and .
     * 3. Password must not be empty
     */
    const validateForm = () => {
        const { email, password } = formData;
        
        // Check if email is empty
        if (!email.trim()) {
            setValidationError('Email is required');
            return false;
        }
        
        // Check if email has valid format (contains @ and .)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address');
            return false;
        }
        
        // Check if password is empty
        if (!password.trim()) {
            setValidationError('Password is required');
            return false;
        }
        
        return true;
    };

    // ============================================================
    // HANDLE FORM SUBMISSION
    // ============================================================
    /**
     * Processes login form submission
     * @param {Event} e - Form submit event
     * 
     * FLOW:
     * 1. Prevent default browser form submission
     * 2. Validate form data
     * 3. Call login function from AuthContext
     * 4. If successful, redirect to dashboard
     */
    const handleSubmit = async (e) => {
        // Prevent page refresh on form submit
        e.preventDefault();
        
        // Validate form before making API call
        if (!validateForm()) {
            return;
        }
        
        // Call login function from AuthContext
        // This will make API call to backend
        const success = await login(formData.email, formData.password);
        
        // If login successful, redirect to rooms page
        if (success) {
            navigate('/rooms');
        }
    };

    return (
        // Full screen container with gradient background
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            
            {/* Login Card Container */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue to NexTalk</p>
                </div>
                
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Email Input Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    
                    {/* Password Input Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    
                    {/* Error Message Display */}
                    {(validationError || error) && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                            {validationError || error}
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                {/* Link to Register Page */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-600">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* Show loading spinner when API call is in progress */}
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Login;