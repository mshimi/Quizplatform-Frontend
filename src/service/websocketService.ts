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

const topicSubscriptions = new Map<string, { subscription: StompSubscription; callback: (message: unknown) => void }>();

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
            console.log('WebSocket: Connected', frame);
            // Subscribe to user-specific notifications
            notificationSubscription = stompClient!.subscribe(
                '/user/queue/notification',
                (message) => {
                    const notification: Notification = JSON.parse(message.body);
                    onNotification(notification);
                }
            );

            // --- THIS IS NEW ---
            // Resubscribe to any public topics that were active before a disconnect
            topicSubscriptions.forEach((value, key) => {
                value.subscription = stompClient!.subscribe(key, (message) => {
                    value.callback(JSON.parse(message.body));
                });
                console.log(`WebSocket: Resubscribed to topic: ${key}`);
            });
            // --- END NEW ---
        },
        onStompError: (frame: IFrame) => {
            console.error('WebSocket: Stomp error', frame);

        },
        onWebSocketError: (event: Event) => {
            console.error('WebSocket: Stomp error', event);


        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    // FIX: Added a null check.
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
    }
    topicSubscriptions.clear();
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


/**
 * Subscribes to a public STOMP topic.
 * @param topic The topic destination (e.g., '/topic/lobbies').
 * @param callback The function to call when a message is received on this topic.
 */
export const subscribeToTopic = <T>(topic: string, callback: (message: T) => void) => {
    if (!stompClient?.active) {
        console.warn(`WebSocket not active. Cannot subscribe to ${topic}. It will be subscribed upon connection.`);
    }

    if (topicSubscriptions.has(topic)) {
        console.warn(`Already subscribed to ${topic}.`);
        return;
    }

    const subscription = stompClient?.active
        ? stompClient.subscribe(topic, (message) => {
            // The message body is parsed and cast to the expected type T.
            callback(JSON.parse(message.body) as T);
        })
        : null;

    topicSubscriptions.set(topic, { subscription: subscription!, callback: callback as (message: unknown) => void });
    console.log(`WebSocket: Subscribed to topic: ${topic}`);
};


export const unsubscribeFromTopic = (topic: string) => {
    if (topicSubscriptions.has(topic)) {
        topicSubscriptions.get(topic)?.subscription?.unsubscribe();
        topicSubscriptions.delete(topic);
        console.log(`WebSocket: Unsubscribed from topic: ${topic}`);
    }
};