import { createContext } from 'react';
import type { Notification } from '../types';

export interface WebSocketContextType {
    connect: () => void;
    disconnect: () => void;
    notifications: Notification[];
    subscribe: <T>(topic: string, callback: (message: T) => void) => void;
    unsubscribe: (topic: string) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
