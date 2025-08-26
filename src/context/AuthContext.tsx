// context/AuthContext.tsx
import {  useState, useEffect, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../service/authService';
import type {  AuthenticationResponse } from '../types';
import {AuthContext, type AuthContextType} from './authContextObject';
import { useWebSocket } from '../hooks/useWebSocket'; // <-- CORRECTED IMPORT PATH



// Export the context so it can be used by the useAuth hook in a separate file.

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const { connect, disconnect } = useWebSocket(); // Get connect/disconnect from WebSocketContext
    const [isAuthAttempted, setIsAuthAttempted] = useState<boolean>(!!localStorage.getItem('accessToken'));

    const [authError, setAuthError] = useState<string | null>(null);


    // Query to fetch the current user if a token exists
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: isAuthAttempted, // Only run if we think we are authenticated
        retry: 1, // Don't retry endlessly on failure
    });

    // Effect to handle what happens after the user query resolves
    useEffect(() => {
        if (isError) {
            // If the query fails, the token is invalid, so log out
            handleLogout();
        } else if(user){
            connect();
        }
    }, [isError, user, connect]);


    // This function is called on successful login or registration.
    const handleSuccess = (data: AuthenticationResponse) => {
        // Use `data.access_token` to match the backend DTO and type definition.
        localStorage.setItem('accessToken', data.access_token);
        setIsAuthAttempted(true);
        // Invalidate user query to refetch with the new token, which populates the user object.
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    };

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onMutate: async () => {
            if(authError !== null){
                setAuthError(null);
            }
        },
        onSuccess: handleSuccess,
        onError: (error) => {
            console.error("Login failed:", error);
            // You can customize this message
            setAuthError("E-Mail oder Passwort ist ungültig. Bitte versuchen Sie es erneut.");
        },    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onMutate: async () => {
            if(authError !== null){
                setAuthError(null);
            }
        },
        onSuccess: handleSuccess,
        onError: (error) => {
            console.error("Registration failed:", error);
            setAuthError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthAttempted(false);
        // Clear the TanStack Query cache to remove all user data
        queryClient.clear();
        disconnect(); // Disconnect WebSocket on logout

    };

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: handleLogout,
        onError: handleLogout, // Also clear frontend state on server error
    });

    const authContextValue: AuthContextType = {
        user: user || null,
        login: (credentials) => loginMutation.mutate(credentials),
        register: (userData) => registerMutation.mutate(userData),
        logout: () => logoutMutation.mutate(),
        // The source of truth for authentication is having a valid user object from the backend.
        isAuthenticated: !isError && !!user,
        isLoading: isLoading,
        authError: authError,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
