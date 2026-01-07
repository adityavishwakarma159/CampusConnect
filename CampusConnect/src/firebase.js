import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging = null;

try {
    messaging = getMessaging(app);
} catch (error) {
    console.log('Firebase messaging not supported:', error);
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
    try {
        if (!messaging) {
            console.log('Firebase messaging not available');
            return null;
        }

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            });

            console.log('FCM Token:', token);
            return token;
        } else {
            console.log('Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

// Listen for foreground messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) {
            resolve(null);
            return;
        }

        onMessage(messaging, (payload) => {
            console.log('Message received:', payload);
            resolve(payload);
        });
    });

export { messaging };
