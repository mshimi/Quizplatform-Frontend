import { Client, type IFrame, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '../types';

type NotificationCallback = (notification: Notification) => void;

let stompClient: Client | null = null;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let notificationSubscription: StompSubscription | null = null;

// --- Connection Management ---

export const connectWebSocket = (onNotification: NotificationCallback) => {
    const jwtToken = localStorage.getItem('accessToken');
    if (!jwtToken) {
        console.error("WebSocket: No JWT token found. Cannot connect.");
        return;
    }

    if (stompClient?.active) {
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws-connect'),
        connectHeaders: {
            Authorization: `Bearer ${jwtToken}`,
        },
        onConnect: (frame: IFrame) => {
            notificationSubscription = stompClient!.subscribe(
                '/user/queue/notification',
                (message) => {
                    const notification: Notification = JSON.parse(message.body);
                    onNotification(notification);
                }
            );
        },
        onStompError: (frame: IFrame) => {

        },
        onWebSocketError: (event: Event) => {

        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    // FIX: Added a null check.
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
    }
    stompClient = null;
    notificationSubscription = null;
};

// --- Action Functions (sending messages) ---

export const sendChatMessage = (recipientId: string, content: string) => {
    // FIX: Added a null check.
    if (!stompClient || !stompClient.active) {
        return;
    }
    stompClient.publish({
        destination: '/app/chat/send',
        body: JSON.stringify({ recipientId, content }),
    });
};

export const sendQuizInvite = (recipientId: string, moduleId: string) => {
    // FIX: Added a null check.
    if (!stompClient || !stompClient.active) {
        return;
    }
    stompClient.publish({
        destination: '/app/quiz/invite',
        body: JSON.stringify({ recipientId, moduleId }),
    });
};