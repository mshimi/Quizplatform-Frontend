// context/authContextObject.ts
import { createContext } from 'react';
import type { AuthenticationRequest, RegisterRequest, User } from '../types';

export interface AuthContextType {
    user: User | null;
    login: (credentials: AuthenticationRequest) => void;
    register: (userData: RegisterRequest) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// This file now exclusively defines and exports the context object and its type.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
