import { initializeApp } from "firebase/app"; // Import the function to initialize a Firebase app.
import { getAuth } from "firebase/auth";     // Import the function to get the authentication service.

// Check if the global Firebase configuration is available (provided by the execution environment).
if (typeof __firebase_config === 'undefined') {
  // Log an error if the configuration is missing, which would prevent Firebase from working.
  console.error("Firebase configuration variable (__firebase_config) is missing.");
}

// Parse the global configuration string into a JavaScript object.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Declare a variable to hold the initialized Firebase app instance.
let app;
// Ensure initialization only runs in the browser environment and only once.
if (typeof window !== "undefined" && !app) {
  try {
    // Initialize the Firebase app with the parsed configuration.
    app = initializeApp(firebaseConfig);
  } catch (error) {
    // Log any errors that occur during initialization.
    console.error("Firebase initialization error on client:", error);
  }
}

// Get the Firebase Auth instance from the initialized app, or set to null if initialization failed.
const auth = app ? getAuth(app) : null;

// Export the Auth instance and the App instance for use in other client modules.
export { auth, app };
