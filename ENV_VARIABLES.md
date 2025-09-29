# Environment Variables Setup

Create a `.env` file in your project root with the following variables:

## Firebase Configuration (Required)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## ElevenLabs Voice Assistant Configuration (Optional)

```env
VITE_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here
VITE_ELEVENLABS_CONVERSATION_TOKEN=your_elevenlabs_conversation_token_here
```

## Google Services (Optional)

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## App Configuration

```env
VITE_APP_NAME=Toura
VITE_APP_VERSION=1.0.0
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General tab
4. Scroll down to "Your apps" section
5. Click "Add app" and select Web (</>) 
6. Register your app with name "Toura"
7. Copy the config object values to your .env file

## How to Enable Firebase Authentication

1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click and enable
   - **Google**: Click, enable, and add your support email
   - **Phone**: Click and enable (requires phone verification setup)

## Required Firebase Features

- **Authentication**: For user sign-in/sign-up
- **Firestore Database**: For storing user data (optional)
- **Hosting**: For deployment (optional)

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different Firebase projects for development and production
- Restrict API keys in production for better security 