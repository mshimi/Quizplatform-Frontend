import { useState, useCallback, type ReactNode} from 'react';
import { connectWebSocket, disconnectWebSocket } from '../service/websocketService';
import type { Notification } from '../types'; // Create this type
import { WebSocketContext } from './webSocketContextObject';


export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleNewNotification = useCallback((notification: Notification) => {
        console.log('New notification received:', notification);
        // You would have logic here to handle different notification types
        setNotifications(prev => [notification, ...prev]);
    }, []);

    const connect = useCallback(() => {
        connectWebSocket(handleNewNotification);
    }, [handleNewNotification]);

    const disconnect = () => {
        disconnectWebSocket();
        setNotifications([]); // Clear notifications on disconnect
    };

    const value = { connect, disconnect, notifications };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

