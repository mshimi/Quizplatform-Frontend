// hooks/useAuth.ts
import { useContext } from 'react';
import {AuthContext} from "../context/authContextObject.ts";

// Custom hook for easy access to the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
