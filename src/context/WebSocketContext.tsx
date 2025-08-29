import { useState, useCallback, useEffect, type ReactNode } from 'react';
import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToTopic,
    unsubscribeFromTopic,
} from '../service/websocketService';
import type { Notification } from '../types';
import { WebSocketContext } from './webSocketContextObject';

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleNewNotification = useCallback((notification: Notification) => {
        // eslint-disable-next-line no-console
        console.log('New notification received:', notification);
        setNotifications((prev) => [notification, ...prev]);
    }, []);

    // Auto-connect on mount; disconnect on unmount
    useEffect(() => {
        connectWebSocket(handleNewNotification);
        return () => disconnectWebSocket();
    }, [handleNewNotification]);

    const connect = useCallback(() => {
        connectWebSocket(handleNewNotification);
    }, [handleNewNotification]);

    const disconnect = useCallback(() => {
        disconnectWebSocket();
        setNotifications([]);
    }, []);

    const value = {
        connect,
        disconnect,
        notifications,
        subscribe: subscribeToTopic,
        unsubscribe: unsubscribeFromTopic,
    };

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
