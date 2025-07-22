// components/layout/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show a loading indicator while checking auth status
    if (isLoading) {
        return <div>Loading session...</div>; // Or your custom Spinner component
    }

    // If authenticated, render the child route. Otherwise, redirect to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;