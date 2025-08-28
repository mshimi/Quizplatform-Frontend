import { createContext } from 'react';
import type { Notification } from '../types'; // Adjust path if needed

export interface WebSocketContextType {
    connect: () => void;
    disconnect: () => void;
    notifications: Notification[];
    subscribe: <T>(topic: string, callback: (message: T) => void) => void;
    unsubscribe: (topic: string) => void;
}

// Define and export the context object.
export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);