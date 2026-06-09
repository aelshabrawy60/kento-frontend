import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoading from './Loading/PageLoading';

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <PageLoading />;
    }

    if (!isAuthenticated) {
        // Determine where to redirect based on the path or role
        const isAdminPath = location.pathname.startsWith('/admin');
        const isVendorPath = location.pathname.startsWith('/vendor');
        let loginPath;
        if (isAdminPath || role === 'ADMIN') {
            loginPath = '/admin/login';
        } else if (isVendorPath) {
            loginPath = '/vendor/login';
        } else {
            loginPath = '/client/login';
        }
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        // If role doesn't match, redirect to their respective dashboard
        const userRole = user?.role;
        if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
        if (userRole === 'VENDOR') return <Navigate to="/vendor" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
