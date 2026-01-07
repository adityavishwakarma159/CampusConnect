import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = {};
        this.pendingSubscriptions = [];
        this.pendingMessages = [];
        this.token = null; // Store token for reconnection
    }

    connect(token, onMessageReceived, onConnected) {
        if (this.client && this.client.active) {
            console.log('WebSocket already active');
            if (this.connected && onConnected) onConnected();
            return;
        }

        this.token = token;
        const socket = new SockJS('http://localhost:8080/ws');

        this.client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                // Only log important STOMP frames to reduce noise
                if (str.includes('CONNECTED') || str.includes('ERROR')) {
                    console.log('STOMP: ' + str);
                }
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                this.connected = true;

                // Resubscribe to user queue
                this.subscribeToUserQueue(onMessageReceived);

                // Process pending subscriptions
                this.processPendingSubscriptions();

                // Process pending messages
                this.processPendingMessages();

                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
                this.connected = false;
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                this.connected = false;
            }
        });

        this.client.activate();
    }

    processPendingSubscriptions() {
        if (this.pendingSubscriptions.length > 0) {
            console.log(`Processing ${this.pendingSubscriptions.length} pending subscriptions`);
            const queue = [...this.pendingSubscriptions];
            this.pendingSubscriptions = [];
            queue.forEach(item => {
                if (item.type === 'group') {
                    this.subscribeToGroupChat(item.departmentId, item.callback);
                }
            });
        }
    }

    processPendingMessages() {
        if (this.pendingMessages.length > 0) {
            console.log(`Processing ${this.pendingMessages.length} pending messages`);
            const queue = [...this.pendingMessages];
            this.pendingMessages = [];
            queue.forEach(item => {
                if (item.type === 'direct') {
                    this.sendMessage(item.payload);
                } else if (item.type === 'group') {
                    this.sendGroupMessage(item.payload.message, item.payload.departmentId, item.payload.chatType);
                }
            });
        }
    }

    subscribeToUserQueue(callback) {
        if (!this.client || !this.connected) {
            console.log('Queueing user subscription');
            // We don't queue user subscription here because it's called in onConnect anyway
            return;
        }

        const userId = this.getUserIdFromToken();
        if (this.subscriptions['user_queue']) {
            this.subscriptions['user_queue'].unsubscribe();
        }

        this.subscriptions['user_queue'] = this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
    }

    sendMessage(message) {
        if (!this.client || !this.connected) {
            console.log('Queueing direct message');
            this.pendingMessages.push({ type: 'direct', payload: message });
            return;
        }

        this.client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(message),
        });
    }

    markAsRead(otherUserId) {
        if (!this.client || !this.connected) return;

        this.client.publish({
            destination: '/app/chat.markAsRead',
            body: JSON.stringify(otherUserId),
        });
    }

    subscribeToGroupChat(departmentId, callback) {
        if (!this.client || !this.connected) {
            console.log('Queueing group subscription for dept:', departmentId);
            this.pendingSubscriptions.push({ type: 'group', departmentId, callback });
            return;
        }

        // Unsubscribe if already subscribed to avoid duplicates
        if (this.subscriptions[`group_${departmentId}`]) {
            this.subscriptions[`group_${departmentId}`].unsubscribe();
        }

        const subscription = this.client.subscribe(
            `/topic/department/${departmentId}`,
            (message) => {
                try {
                    const data = JSON.parse(message.body);
                    callback(data);
                } catch (error) {
                    console.error('Error parsing group message:', error);
                }
            }
        );

        this.subscriptions[`group_${departmentId}`] = subscription;
    }

    sendGroupMessage(message, departmentId, chatType) {
        if (!this.client || !this.connected) {
            console.log('Queueing group message');
            this.pendingMessages.push({
                type: 'group',
                payload: { message, departmentId, chatType }
            });
            return;
        }

        this.client.publish({
            destination: '/app/chat.sendGroupMessage',
            body: JSON.stringify({
                message: message,
                departmentId: departmentId,
                chatType: chatType
            }),
        });
    }

    unsubscribeFromGroup(departmentId) {
        const sub = this.subscriptions[`group_${departmentId}`];
        if (sub) {
            sub.unsubscribe();
            delete this.subscriptions[`group_${departmentId}`];
        }
        // Also remove from pending if present
        this.pendingSubscriptions = this.pendingSubscriptions.filter(
            item => !(item.type === 'group' && item.departmentId === departmentId)
        );
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
            this.subscriptions = {};
            // We usually keep pending items if we expect a reconnect using same instance? 
            // Better to clear them on explicit disconnect.
            this.pendingSubscriptions = [];
            this.pendingMessages = [];
        }
    }

    getUserIdFromToken() {
        const token = this.token || localStorage.getItem('accessToken');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.sub;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();
