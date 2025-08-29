//src/hooks/useWebSocket.ts

import { useContext } from 'react';
import { WebSocketContext } from '../context/webSocketContextObject';

export const useWebSocket = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return ctx;
};
