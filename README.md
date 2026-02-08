# Love Notes for Regine 💖

A beautiful love notes application for daily reminders with Firebase integration.

## Features

- 💕 Daily love note reminders
- 🔔 Browser notifications support
- 💬 Reply to love notes
- 📝 Admin dashboard for managing notes
- 📦 Archive functionality
- 🎨 Beautiful romantic design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Copy your Firebase configuration from Project Settings
4. Create a `.env` file in the root directory (copy from `.env.example`)
5. Add your Firebase credentials to the `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id-here
```

### 3. Firestore Security Rules

Set up the following security rules in your Firebase Console (Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access only to authenticated users (for admin)
      // For now, allow all writes - you can add authentication later
      allow write: if true;
    }
  }
}
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### Public View
- Visit the home page to see the current love note
- Enable notifications to receive daily reminders
- Reply to love notes

### Admin Dashboard
- Navigate to `/admin/login` (password: `lovenotes2026`)
- Create new love notes
- View all replies
- Archive or delete notes
- Export notes data

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase (Firestore)
- Tailwind CSS
- shadcn/ui components
- React Router

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (useNotes)
├── lib/            # Firebase configuration
├── pages/          # Page components
└── App.tsx         # Main app component
```

## Future Enhancements

- Firebase Authentication for admin access
- Scheduled notifications using Firebase Cloud Functions
- Email notifications
- Multiple recipients support
- Custom themes
