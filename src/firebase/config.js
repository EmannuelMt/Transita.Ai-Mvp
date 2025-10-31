// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyA8CCv943Q_rpi47LBv6-S-woYnolFbcLM",
  authDomain: "transitaai-b4d4f.firebaseapp.com",
  projectId: "transitaai-b4d4f",
  storageBucket: "transitaai-b4d4f.firebasestorage.app",
  messagingSenderId: "409048408677",
  appId: "1:409048408677:web:43e31bacdb5fa2901e9c8c",
  measurementId: "G-JES8FJNL41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;