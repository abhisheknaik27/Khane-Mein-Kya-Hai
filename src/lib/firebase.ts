import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

declare global {
  interface Window {
    __firebase_config?: string;
    __app_id?: string;
  }
}
declare const __firebase_config: string | undefined;

const getFirebaseConfig = () => {
  const localConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Logic to read from window object if needed (kept from your original code)
  if (typeof window !== "undefined" && window.__firebase_config) {
    try {
      return JSON.parse(window.__firebase_config);
    } catch (e) {}
  }
  try {
    if (typeof __firebase_config !== "undefined")
      return JSON.parse(__firebase_config);
  } catch (e) {}

  return localConfig;
};

const firebaseConfig = getFirebaseConfig();

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let firebaseError: string = "";

try {
  if (getApps().length) {
    app = getApp();
  } else if (firebaseConfig && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    firebaseError = "Firebase config missing.";
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (e: any) {
  console.error("Firebase init failed:", e);
  firebaseError = e.message;
}

export { app, auth, db, firebaseError };
