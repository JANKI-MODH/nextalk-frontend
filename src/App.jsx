import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import Chat from './pages/Chat';  // ← ADD THIS
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function App() {
    const { loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner />;
    }
    
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/rooms" element={
                <ProtectedRoute>
                    <Rooms />
                </ProtectedRoute>
            } />
            <Route path="/chat/:roomId" element={  // ← ADD THIS
                <ProtectedRoute>
                    <Chat />
                </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={
                <Navigate to="/rooms" replace />
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
    );
}

export default App;