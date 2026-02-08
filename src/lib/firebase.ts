import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "[Google API Key REDACTED]",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "love-notes-for-regine-62c65.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "love-notes-for-regine-62c65",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "love-notes-for-regine-62c65.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "804540221651",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:804540221651:web:a2a8fe123bfffe8ebe6c26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
