
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY,
  authDomain:import.meta.env.VITE_AUTH_DOMAIN,
  projectId:import.meta.env.VITE_PROJET_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId:import.meta.env.VITE_SENDER_ID,
  appId:import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

