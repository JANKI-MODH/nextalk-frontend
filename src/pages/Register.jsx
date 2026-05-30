import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Register Page Component
 * Allows new users to create an account
 * 
 * Features:
 * - Username, email, password fields
 * - Password confirmation
 * - Real-time validation
 * - Auto-login after registration
 */
const Register = () => {
    // ============================================================
    // STATE VARIABLES
    // ============================================================
    const navigate = useNavigate();
    const { register, error, loading } = useAuth();
    
    // Form data state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    // Local validation errors
    const [validationErrors, setValidationErrors] = useState({});

    // ============================================================
    // HANDLE INPUT CHANGE
    // ============================================================
    /**
     * Updates form data when user types
     * Clears validation error for the specific field being typed in
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // ============================================================
    // FORM VALIDATION
    // ============================================================
    /**
     * Validates all form fields before submission
     * @returns {boolean} - True if all validations pass
     * 
     * Validation rules:
     * - Username: 3-20 characters, letters/numbers/underscore only
     * - Email: Valid email format
     * - Password: Minimum 6 characters
     * - Confirm password: Must match password
     */
    const validateForm = () => {
        const errors = {};
        const { username, email, password, confirmPassword } = formData;
        
        // Username validation
        if (!username.trim()) {
            errors.username = 'Username is required';
        } else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (username.length > 20) {
            errors.username = 'Username must be less than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.username = 'Username can only contain letters, numbers, and underscore';
        }
        
        // Email validation
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = 'Please enter a valid email address';
            }
        }
        
        // Password validation
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        // Confirm password validation
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ============================================================
    // HANDLE FORM SUBMISSION
    // ============================================================
    /**
     * Processes registration form submission
     * 
     * FLOW:
     * 1. Validate form data
     * 2. Call register function (which auto-logs in after success)
     * 3. Redirect to rooms page on success
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const success = await register(
            formData.username,
            formData.email,
            formData.password
        );
        
        if (success) {
            navigate('/rooms');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join NexTalk and start chatting</p>
                </div>
                
                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Username Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                validationErrors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                        )}
                    </div>
                    
                    {/* Email Field */}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>
                    
                    {/* Password Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password (min 6 characters)"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                validationErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>
                    
                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>
                    
                    {/* Error Display */}
                    {error && !validationErrors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                {/* Link to Login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
            
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default Register;