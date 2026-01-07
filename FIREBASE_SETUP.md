# Firebase Configuration for Campus Connect

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Campus Connect"
4. Follow the setup wizard

### 2. Enable Cloud Messaging
1. In Firebase Console, go to Project Settings
2. Navigate to "Cloud Messaging" tab
3. Note down your:
   - Server Key (for backend)
   - Sender ID
   - Web Push certificates (VAPID key)

### 3. Add Web App
1. In Project Settings, click "Add app" → Web
2. Register app with nickname: "Campus Connect Web"
3. Copy the Firebase configuration object

### 4. Configure Frontend

Create `.env.local` file in `d:\Demo\CampusConnect\`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### 5. Configure Backend

Add to `application.properties`:

```properties
# Firebase Configuration
firebase.service-account-key=path/to/serviceAccountKey.json
```

Download service account key:
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccountKey.json` in `d:\Demo\backend\src\main\resources\`

## Files Created

- `firebase.js` - Firebase initialization
- `firebase-messaging-sw.js` - Service worker for background notifications
- `FCMService.java` - Backend service for sending push notifications

## Testing

1. Allow notifications when prompted in browser
2. Create an announcement
3. Check if notification appears in:
   - Notification bell dropdown
   - Browser notification (if tab is not active)

## Notes

- FCM is optional for Sprint 3
- In-app notifications work without FCM
- FCM adds browser push notifications when tab is inactive
