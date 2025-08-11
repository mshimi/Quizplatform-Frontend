import { createContext } from 'react';
import type { Notification } from '../types'; // Adjust path if needed

export interface WebSocketContextType {
    connect: () => void;
    disconnect: () => void;
    notifications: Notification[];
}

// Define and export the context object.
export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);