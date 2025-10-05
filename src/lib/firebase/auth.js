import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

// This import must correctly point to and use the 'auth' object initialized in clientApp.js
import { auth } from "@/src/lib/firebase/clientApp";

export function onAuthStateChanged(cb) {
  if (!auth) return () => {};
  return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb) {
  if (!auth) return () => {};
  return _onIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    if (auth) {
      await signInWithPopup(auth, provider);
    } else {
      console.error("Firebase Auth not initialized when trying to sign in.");
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    if (auth) {
      await firebaseSignOut(auth);
    } else {
      console.error("Firebase Auth not initialized when trying to sign out.");
    }
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
