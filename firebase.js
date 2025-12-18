import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 👈 Import Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './src/config/firebase.config.ts';

console.log('Firebase config:', firebaseConfig);

const app = initializeApp(firebaseConfig);

// Conditionally initialize Analytics
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Initialize Firestore
const db = getFirestore(app);

console.log('Firebase Auth initialized:', auth);

export { app, analytics, auth, db }; // 👈 Export db too
