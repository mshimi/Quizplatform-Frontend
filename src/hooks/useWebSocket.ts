import { useContext } from 'react';
import { WebSocketContext } from '../context/webSocketContextObject';

// Custom hook for easy access to the context
export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};