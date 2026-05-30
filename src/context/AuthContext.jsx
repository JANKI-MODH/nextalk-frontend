import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated()) {
            setUser(getCurrentUser());
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await loginService(email, password);
            
            if (response.success) {
                setUser(response.user);
                return true;
            } else {
                setError(response.message);
                return false;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            setError(null);
            const response = await registerService(username, email, password);
            
            if (response.success) {
                return await login(email, password);
            } else {
                setError(response.message);
                return false;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
