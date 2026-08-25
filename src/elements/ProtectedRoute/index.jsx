import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./../AuthProvider";
import React from 'react'

export const ProtectedRoute = () => {
    const { token, ready } = useAuth();
    if (!ready) return null;
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};