import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Import Firestore
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWBB4vWnb7a0i_YsXEF-3JPh3ezw-Cu7c",
  authDomain: "zimways.firebaseapp.com",
  projectId: "zimways",
  storageBucket: "zimways.firebasestorage.app",
  messagingSenderId: "145459786800",
  appId: "1:145459786800:web:8dd3dcfcb187b9e81029f5",
  measurementId: "G-7DG5KS74CE"
};

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

console.log("Firebase Auth initialized:", auth);

export { app, analytics, auth, db }; // 👈 Export db too
