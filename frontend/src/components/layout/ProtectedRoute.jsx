import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getMe } from '../../services/authService';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token, setUser, clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(!user && !!token);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (token && !user) {
                try {
                    const res = await getMe();
                    setUser(res.data.data.user);
                } catch (error) {
                    clearAuth();
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [token, user, setUser, clearAuth]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};
