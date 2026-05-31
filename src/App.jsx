import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import Chat from './pages/Chat';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

function AppContent() {
    const { loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={
                <ProtectedRoute><Rooms /></ProtectedRoute>
            } />
            <Route path="/chat/:roomId" element={
                <ProtectedRoute><Chat /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;