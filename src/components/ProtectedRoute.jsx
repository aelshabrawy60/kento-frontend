import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        // Determine where to redirect based on the path
        const isVendorPath = location.pathname.startsWith('/vendor');
        const loginPath = isVendorPath ? '/vendor/login' : '/client/login';
        
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        // If role doesn't match, redirect to their respective dashboard
        const dashboardPath = user?.role === 'VENDOR' ? '/vendor' : '/';
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
