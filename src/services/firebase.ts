// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHY9ywbv4BdB5xVXuy5ZFT6_jm-H45oPY",
  authDomain: "erp-demo-ai-portfolio.firebaseapp.com",
  projectId: "erp-demo-ai-portfolio",
  storageBucket: "erp-demo-ai-portfolio.firebasestorage.app",
  messagingSenderId: "247591829854",
  appId: "1:247591829854:web:f8d64caa8f2c1723224fcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Analytics removed - can cause issues in dev)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
