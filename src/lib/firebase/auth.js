import {
  GoogleAuthProvider,      // Import the specific provider for Google authentication.
  signInWithPopup,         // Import function for pop-up sign-in flow.
  onAuthStateChanged as _onAuthStateChanged, // Import the standard auth state observer and alias it for clarity.
  onIdTokenChanged as _onIdTokenChanged,     // Import the ID token observer (used for session cookie management) and alias it.
  signOut as firebaseSignOut,                // Import the modular signOut function and alias it to avoid naming conflicts.
} from "firebase/auth";

// Import the client Auth instance initialized in clientApp.js
import { auth } from "@/src/lib/firebase/clientApp";

/**
 * Attaches an observer to the Auth object to track when a user's sign-in state changes.
 * This function wraps the native Firebase observer for use in client components.
 * @param {function(import('firebase/auth').User | null): void} cb The callback function to run on state change.
 * @returns {function(): void} An unsubscribe function.
 */
export function onAuthStateChanged(cb) {
  if (!auth) return () => {}; // Check if Auth is initialized; if not, return a function that does nothing gracefully.
  return _onAuthStateChanged(auth, cb); // Return the result of the Firebase auth state observer.
}

/**
 * Attaches an observer to the Auth object to track when a user's ID token changes.
 * This is the function called by Header.jsx to set/delete the server session cookie.
 * @param {function(import('firebase/auth').User | null): void} cb The callback function to run on state change.
 * @returns {function(): void} An unsubscribe function.
 */
export function onIdTokenChanged(cb) {
  if (!auth) return () => {}; // Check if Auth is initialized; if not, return a no-op function.
  return _onIdTokenChanged(auth, cb); // Return the result of the Firebase ID token observer.
}

/**
 * Initiates the Google sign-in process using a popup window.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider(); // Create a new instance of the Google Auth Provider.

  try {
    if (auth) {
      await signInWithPopup(auth, provider); // Execute the sign-in using a popup window.
    } else {
      console.error("Firebase Auth not initialized."); // Log error if auth instance is missing.
    }
  } catch (error) {
    console.error("Error signing in with Google", error); // Log any error during the sign-in process.
  }
}

/**
 * Signs out the currently authenticated user.
 */
export async function signOut() {
  try {
    if (auth) {
      // Use the imported modular signOut function, passing the auth instance
      await firebaseSignOut(auth); // Execute the sign-out function.
    } else {
      console.error("Firebase Auth not initialized."); // Log error if auth instance is missing.
    }
  } catch (error) {
    console.error("Error signing out with Google", error); // Log any error during the sign-out process.
  }
}
