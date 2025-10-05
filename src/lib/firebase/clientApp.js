// Import the core function to initialize a Firebase app.
import { initializeApp } from "firebase/app"; 
// Import the function to access the authentication service.
import { getAuth } from "firebase/auth"; 

// Check if the global Firebase configuration is available (provided by the execution environment).
if (typeof __firebase_config === 'undefined') {
  // Log an error if the configuration is missing, which would prevent Firebase from working.
  console.error("Firebase configuration variable (__firebase_config) is missing.");
}

// Parse the global configuration string into a JavaScript object.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Declare a variable to hold the initialized Firebase app instance.
let app;

// IMPORTANT: Ensure initialization only runs in the browser environment and only once.
if (typeof window !== "undefined") {
  // Check if the app has already been initialized (important for hot-reloading).
  if (!app) {
    try {
      // Initialize the Firebase app with the parsed configuration.
      app = initializeApp(firebaseConfig);
    } catch (error) {
      // Log any errors that occur during initialization.
      console.error("Firebase initialization error on client:", error);
    }
  }
}

// Get the Firebase Auth instance from the initialized app.
// If the app is null (e.g., during server render), auth will also be null.
const auth = app ? getAuth(app) : null;

// Export the Auth instance and the App instance for use in other client modules (like auth.js).
export { auth, app };
