// src/service/websocketService.ts
import { Client, type IFrame, type StompSubscription, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification } from '../types';

type AnyCallback = (message: unknown) => void;
type NotificationCallback = (notification: Notification) => void;

let client: Client | null = null;
let isConnected = false;

/**
 * One real STOMP subscription per topic (when connected).
 * We fan out incoming messages to all registered callbacks for that topic.
 */
const activeSubs = new Map<string, StompSubscription>();

/** All callbacks listening to a given topic (can be 0..n). */
const topicCallbacks = new Map<string, Set<AnyCallback>>();

/** Topics requested before the socket connects; we subscribe them on onConnect. */
const pendingTopics = new Set<string>();

/** Helper: parse message body safely. */
function parseBody(msg: IMessage): unknown {
    try {
        return msg.body ? JSON.parse(msg.body) : null;
    } catch {
        return msg.body;
    }
}

/** Subscribe to a STOMP topic once and fan out to all registered callbacks. */
function ensureSubscribed(topic: string) {
    if (!client?.connected || activeSubs.has(topic)) return;

    const sub = client.subscribe(topic, (msg: IMessage) => {
        const payload = parseBody(msg);
        const cbs = topicCallbacks.get(topic);
        if (!cbs || cbs.size === 0) return;

        // fan-out; guard each callback
        cbs.forEach((cb) => {
            try {
                cb(payload);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('WebSocket: topic callback threw', e);
            }
        });
    });

    activeSubs.set(topic, sub);
    // eslint-disable-next-line no-console
    console.log('WebSocket: Subscribed to topic:', topic);
}

/** Tear down the actual STOMP subscription for a topic. */
function teardownSubscription(topic: string) {
    const sub = activeSubs.get(topic);
    if (sub) {
        try {
            sub.unsubscribe();
            // eslint-disable-next-line no-console
            console.log('WebSocket: Unsubscribed from topic:', topic);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('WebSocket: unsubscribe failed (likely disconnected):', e);
        } finally {
            activeSubs.delete(topic);
        }
    }
}

/** Public API: connect / disconnect */
export function connectWebSocket(onNotification: NotificationCallback) {
    if (client?.active) return;

    const jwtToken = localStorage.getItem('accessToken');
    if (!jwtToken) {
        // eslint-disable-next-line no-console
        console.error('WebSocket: No JWT token found. Cannot connect.');
        return;
    }

  //  const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8081/ws-connect';

    const WS_URL = "http://ec2-13-51-207-0.eu-north-1.compute.amazonaws.com:8081/ws-connect"
    client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: { Authorization: `Bearer ${jwtToken}` },
        reconnectDelay: 5000, // auto-reconnect
        onConnect: (frame: IFrame) => {
            // eslint-disable-next-line no-console
            console.log('WebSocket: Connected', frame);
            isConnected = true;

            // 1) subscribe to user notifications
            const notifSub = client!.subscribe('/user/queue/notification', (message: IMessage) => {
                try {
                    const notification: Notification = JSON.parse(message.body);
                    onNotification(notification);
                } catch {
                    // ignore malformed payloads
                }
            });
            activeSubs.set('/user/queue/notification', notifSub);

            // 2) (re)subscribe all topics that currently have callbacks registered
            topicCallbacks.forEach((_set, topic) => ensureSubscribed(topic));

            // 3) subscribe topics that were requested pre-connection
            if (pendingTopics.size) {
                Array.from(pendingTopics).forEach((topic) => ensureSubscribed(topic));
                pendingTopics.clear();
            }
        },
        onStompError: (frame: IFrame) => {
            // eslint-disable-next-line no-console
            console.error('WebSocket: STOMP error', frame);
        },
        onWebSocketError: (evt: Event) => {
            // eslint-disable-next-line no-console
            console.error('WebSocket: WS error', evt);
        },
        onWebSocketClose: () => {
            // eslint-disable-next-line no-console
            console.warn('WebSocket: Closed');
            isConnected = false;

            // Keep topicCallbacks so we can resubscribe on reconnect.
            activeSubs.clear();
        },
    });

    client.activate();
}

export function disconnectWebSocket() {
    try {
        client?.deactivate();
    } finally {
        isConnected = false;
        activeSubs.clear();
        pendingTopics.clear();
        // Keep topicCallbacks? Usually you want a clean slate on explicit disconnect:
        topicCallbacks.clear();
        client = null;
    }
}

/** Public API: subscribe / unsubscribe */
export function subscribeToTopic<T>(topic: string, callback: (message: T) => void) {
    // register the callback in our set for this topic
    let set = topicCallbacks.get(topic);
    if (!set) {
        set = new Set<AnyCallback>();
        topicCallbacks.set(topic, set);
    }
    set.add(callback as AnyCallback);

    if (isConnected && client?.connected) {
        ensureSubscribed(topic);
    } else {
        // queue the topic (we only need it once per topic)
        pendingTopics.add(topic);
        // eslint-disable-next-line no-console
        console.log('WebSocket: Queued subscription:', topic);
    }
}

/**
 * Unsubscribe all callbacks for a topic and tear down the STOMP sub if no listeners remain.
 * NOTE: because the higher-level API only supplies `topic`, this removes *all* callbacks for that topic.
 * If you ever need per-callback unsubscription, refactor this API to return a handle from subscribe().
 */
export function unsubscribeFromTopic(topic: string) {
    // Remove any queued subscription
    pendingTopics.delete(topic);

    // Remove all callbacks for this topic
    topicCallbacks.delete(topic);

    // Tear down the live STOMP subscription if present
    teardownSubscription(topic);
}

/** Optional helpers for sending messages (guarded) */
export function publish(destination: string, body: unknown) {
    if (!client?.connected) return;
    client.publish({
        destination,
        body: JSON.stringify(body),
    });
}

export const sendChatMessage = (recipientId: string, content: string) =>
    publish('/app/chat/send', { recipientId, content });

export const sendQuizInvite = (recipientId: string, moduleId: string) =>
    publish('/app/quiz/invite', { recipientId, moduleId });
