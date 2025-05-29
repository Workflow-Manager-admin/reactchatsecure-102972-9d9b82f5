///////////////////////
// PUBLIC_INTERFACE
// firebase.js
///////////////////////
// Firebase config and authentication utility.
// Insert your Firebase config object below.

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// TODO: Replace with your own Firebase project config:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// PUBLIC_INTERFACE
export function signup(email, password) {
  /** Signup a new user */
  return createUserWithEmailAndPassword(auth, email, password);
}

// PUBLIC_INTERFACE
export function login(email, password) {
  /** Login with email and password */
  return signInWithEmailAndPassword(auth, email, password);
}

// PUBLIC_INTERFACE
export function logout() {
  /** Logout the current user */
  return signOut(auth);
}

// PUBLIC_INTERFACE
export function subscribeToAuthChange(callback) {
  /** Subscribe to auth state changes */
  return onAuthStateChanged(auth, callback);
}

// PUBLIC_INTERFACE
export { auth };
