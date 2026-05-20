import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" />;
    
    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route 
                            path="/" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/transactions" 
                            element={
                                <ProtectedRoute>
                                    <Transactions />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
