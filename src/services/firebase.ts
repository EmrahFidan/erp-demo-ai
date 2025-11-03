// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaZyGhxXrWkEBS8zvwoQBMyjgw_YJ4Nzo",
  authDomain: "erp-demo-a5e56.firebaseapp.com",
  projectId: "erp-demo-a5e56",
  storageBucket: "erp-demo-a5e56.firebasestorage.app",
  messagingSenderId: "895628567789",
  appId: "1:895628567789:web:214d6b30249630e5f598e4",
  measurementId: "G-F3M9QBWKSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Analytics removed - can cause issues in dev)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
