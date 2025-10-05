// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only"; // Next.js directive to ensure this file is never included in the client bundle, critical for security.

import { cookies } from "next/headers"; // Function to access incoming request headers/cookies on the server.
import { initializeServerApp, initializeApp } from "firebase/app"; // Import necessary Firebase initialization functions.

import { getAuth } from "firebase/auth"; // Import the Auth service function.

/**
 * Returns a Firebase client SDK instance authenticated with the user's session token.
 * This instance can be used within Server Components or Server Actions (SSR/SSG).
 * @returns {Promise<{firebaseServerApp: FirebaseApp, currentUser: User | null}>}
 */
export async function getAuthenticatedAppForUser() {
  // Retrieve the value of the "__session" cookie from the incoming request.
  // This cookie was set on the client-side after a successful sign-in (see Header.jsx).
  const authIdToken = (await cookies()).get("__session")?.value;

  // Firebase Server App is a new feature in the JS SDK that allows you to
  // instantiate the SDK with credentials retrieved from the client & has
  // other affordances for use in server environments.
  const firebaseServerApp = initializeServerApp(
    // initializeApp() must be called first to provide basic app configuration.
    // This is often a placeholder, as the server app will primarily use the provided token.
    initializeApp(),
    {
      authIdToken, // Pass the ID Token from the cookie to authenticate the server-side app instance.
    }
  );

  const auth = getAuth(firebaseServerApp); // Get the authenticated Auth instance for the server app.
  await auth.authStateReady(); // Wait for the authentication state to be fully resolved and the current user to be determined.

  // Return the authenticated app instance and the resolved user object.
  // This allows subsequent server-side code (e.g., database access) to act on behalf of the user.
  return { firebaseServerApp, currentUser: auth.currentUser };
}
