// components/layout/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // We still want to show a loading indicator while checking auth state.
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If the user is authenticated, redirect them away from public pages
    // like login/register to the main dashboard/homepage.
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
