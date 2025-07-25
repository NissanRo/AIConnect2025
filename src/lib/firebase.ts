// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ai-connect-intern-hub",
  appId: "1:111729743168:web:1bae2d632837900003d6a5",
  storageBucket: "ai-connect-intern-hub.firebasestorage.app",
  apiKey: "AIzaSyAlBLNVQTEaNTz4KrHPkUGISqx2iUYeXAY",
  authDomain: "ai-connect-intern-hub.firebaseapp.com",
  messagingSenderId: "111729743168",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
