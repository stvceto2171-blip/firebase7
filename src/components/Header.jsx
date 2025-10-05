"use client"; // Marks this module for client-side rendering (required for hooks, user interactions, and Firebase auth observers).

import React, { useEffect } from "react"; // Import React and the useEffect hook.
import Link from "next/link"; // Import Next.js's Link component for client-side navigation.
import {
  signInWithGoogle, // Import Google sign-in function from your custom Firebase auth utility.
  signOut, // Import sign-out function.
  onIdTokenChanged, // Import the observer for Firebase ID Token changes (key to session management).
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js"; // Import function to populate Firestore with sample data.
import { setCookie, deleteCookie } from "cookies-next"; // Imports utilities for setting and deleting browser cookies.

/**
 * Custom hook to manage and synchronize the user's session state.
 * It listens for ID token changes from Firebase and updates the session cookie accordingly.
 * @param {object | null} initialUser The user object passed from the server-side (if authenticated).
 * @returns {object | null} The active user object.
 */
function useUserSession(initialUser) {
  // useEffect runs after the component mounts on the client side.
  useEffect(() => {
    // onIdTokenChanged is a Firebase Auth observer that runs when the user's token or state changes.
    const unsubscribe = onIdTokenChanged(async (user) => {
      // If a user is present (signed in or token refreshed):
      if (user) {
        // Get the current ID token. This token is used to authenticate requests to the server.
        const idToken = await user.getIdToken();
        // Set the ID token as a session cookie named "__session" for server-side validation.
        await setCookie("__session", idToken);
      } else {
        // If no user is present (signed out):
        // Delete the session cookie to clear the server-side session.
        await deleteCookie("__session");
      }

      // This complex check prevents a redundant page reload if the user object
      // received from the client-side observer is identical to the one passed
      // initially from the server.
      if (initialUser?.uid === user?.uid) {
        return; // Skip the reload if the user state hasn't genuinely changed.
      }

      // Reload the page to force Next.js to run server-side rendering (SSR) again,
      // which will now pick up the new or missing session cookie.
      // This is crucial for synchronizing the client and server authentication states.
      window.location.reload();
    });

    // Clean-up function: Stops listening to Firebase Auth changes when the component unmounts.
    return unsubscribe;
  }, [initialUser]); // Dependency array: Rerun the effect if the initial user object changes.

  return initialUser; // Return the user object, refreshed by the observer logic above.
}

/**
 * The main Header component.
 * @param {object} props The component props, containing the initial user state.
 * @returns {JSX.Element} The header element with dynamic sign-in/out buttons.
 */
export default function Header({ initialUser }) {
  // Use the custom hook to manage the user session and receive the current user object.
  const user = useUserSession(initialUser);

  // Event handler for signing out.
  const handleSignOut = (event) => {
    event.preventDefault(); // Prevent default link behavior.
    signOut(); // Call the Firebase sign-out function.
  };

  // Event handler for signing in.
  const handleSignIn = (event) => {
    event.preventDefault(); // Prevent default link behavior.
    signInWithGoogle(); // Call the Firebase Google sign-in function.
  };

  return (
    <header>
      {/* Logo and App Name, linked to the homepage */}
      <Link href="/" className="logo">
        <img src="/friendly-eats.svg" alt="FriendlyEats" />
        Friendly Eats
      </Link>
      {/* Conditional rendering based on whether a user is logged in */}
      {user ? (
        // --- User is Signed In ---
        <>
          <div className="profile">
            {/* Display user's profile image and display name */}
            <p>
              <img
                className="profileImage"
                src={user.photoURL || "/profile.svg"} // Use user photo or a default placeholder.
                alt={user.email}
              />
              {user.displayName}
            </p>

            {/* Profile Menu (Hidden by default, shown on hover/click) */}
            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  {/* Button to add sample data (Firestore functionality) */}
                  <a href="#" onClick={addFakeRestaurantsAndReviews}>
                    Add sample restaurants
                  </a>
                </li>

                <li>
                  {/* Sign Out Button */}
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        // --- User is Signed Out ---
        <div className="profile">
          {/* Sign In Button that triggers Google sign-in popup */}
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
