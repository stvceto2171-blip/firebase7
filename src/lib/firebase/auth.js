import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  signOut as firebaseSignOut, // Import the modular signOut function and alias it
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/clientApp";

/**
* Attaches an observer to the Auth object to track when a user's sign-in state changes.
* @param {function(import('firebase/auth').User | null): void} cb The callback function to run on state change.
* @returns {function(): void} An unsubscribe function.
*/
export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

/**
* Attaches an observer to the Auth object to track when a user's ID token changes.
* This is useful for refreshing UI or managing server sessions when a token changes.
* @param {function(import('firebase/auth').User | null): void} cb The callback function to run on state change.
* @returns {function(): void} An unsubscribe function.
*/
export function onIdTokenChanged(cb) {
  return _onIdTokenChanged(auth, cb);
}

/**
* Initiates the Google sign-in process using a popup window.
*/
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
      await signInWithPopup(auth, provider);
  } catch (error) {
      console.error("Error signing in with Google", error);
  }
}

/**
* Signs out the currently authenticated user.
*/
export async function signOut() {
  try {
      // Use the imported modular signOut function, passing the auth instance
      await firebaseSignOut(auth);
  } catch (error) {
      console.error("Error signing out with Google", error);
  }
}
