// Import a utility function to generate fake data for seeding the database
import { generateFakeRestaurantsAndReviews } from "@/src/lib/fakeRestaurants.js";

// Import specific functions from the Firebase Firestore modular SDK (v9+)
import {
  collection, // Function to get a reference to a Firestore collection
  onSnapshot, // Function to listen for real-time updates to a query or document
  query, // Function to create a query object
  getDocs, // Function to get the documents from a query (one-time fetch)
  doc, // Function to get a reference to a specific Firestore document
  getDoc, // Function to get the data from a specific document (one-time fetch)
  updateDoc, // Function to update fields in a specific document
  orderBy, // Function to add an 'order by' clause to a query
  Timestamp, // Firestore class for handling date/time data
  runTransaction, // Function to execute a set of operations atomically (transaction)
  where, // Function to add a 'where' clause (filter) to a query
  addDoc, // Function to add a new document to a collection with an auto-generated ID
  getFirestore, // Function to get the Firestore instance (though likely unused here if 'db' is imported)
} from "firebase/firestore";

// Import the initialized Firestore database instance from the client-side Firebase setup
import { db } from "@/src/lib/firebase/clientApp";

// -----------------------------------------------------------------------------
// RESTAURANT UPDATE FUNCTIONS
// -----------------------------------------------------------------------------

// Asynchronously updates the photo URL field for a specific restaurant document
export async function updateRestaurantImageReference(
  restaurantId, // The ID of the restaurant document to update
  publicImageUrl // The new public URL of the image
) {
  // Get a reference to the specific restaurant document within the 'restaurants' collection
  const restaurantRef = doc(collection(db, "restaurants"), restaurantId);
  // Check if the document reference was successfully created
  if (restaurantRef) {
    // Update the 'photo' field of the document with the new image URL
    await updateDoc(restaurantRef, { photo: publicImageUrl });
  }
}

// -----------------------------------------------------------------------------
// RATING/REVIEW FUNCTIONS (STUBS/PLACEHOLDERS)
// -----------------------------------------------------------------------------

// Placeholder function intended for updating average ratings within a transaction
const updateWithRating = async (
  transaction, // The ongoing transaction object
  docRef, // Reference to the restaurant document
  newRatingDocument, // The new rating document to be added
  review // The new review data
) => {
  return; // Currently a stub, does nothing
};

// Placeholder function intended to add a review and update restaurant aggregate rating
export async function addReviewToRestaurant(db, restaurantId, review) {
  return; // Currently a stub, does nothing
}

// -----------------------------------------------------------------------------
// QUERY FILTERING AND DATA FETCHING
// -----------------------------------------------------------------------------

// ✅ Replaced applyQueryFilters (Internal function to build a Firestore query based on filters)
function applyQueryFilters(q, { category, city, price, sort }) {
  // If a category is provided, add a filter for it
  if (category) {
    q = query(q, where("category", "==", category));
  }
  // If a city is provided, add a filter for it
  if (city) {
    q = query(q, where("city", "==", city));
  }
  // If a price is provided, filter by the length of the price string (e.g., "$$" is 2)
  if (price) {
    q = query(q, where("price", "==", price.length)); // price like "$$" becomes 2
  }
  // If sorting by 'Rating' or no sort is specified, order by 'avgRating' descending
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  // If sorting by 'Review' count is requested, order by 'numRatings' descending
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q; // Return the fully constructed query object
}

// ✅ Replaced getRestaurants (Asynchronously fetches a list of restaurants based on filters)
export async function getRestaurants(db = db, filters = {}) {
  // Start building a query for the 'restaurants' collection
  let q = query(collection(db, "restaurants"));

  // Apply all the filtering and sorting rules
  q = applyQueryFilters(q, filters);
  // Execute the one-time query fetch
  const results = await getDocs(q);
  // Map the array of document snapshots to an array of clean data objects
  return results.docs.map((doc) => {
    return {
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread all document fields
      // Convert Firebase Timestamp to a JavaScript Date object for easy use in Client Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Function intended to set up a real-time listener for the restaurant list
export function getRestaurantsSnapshot(cb, filters = {}) {
  return; // Currently a stub, does nothing
}

// Asynchronously fetches a single restaurant document by its ID (one-time fetch)
export async function getRestaurantById(db, restaurantId) {
  // Check for a valid restaurant ID before proceeding
  if (!restaurantId) {
    console.log("Error: Invalid ID received: ", restaurantId);
    return;
  }
  // Get a reference to the specific document
  const docRef = doc(db, "restaurants", restaurantId);
  // Fetch the document data
  const docSnap = await getDoc(docRef);
  // Return the restaurant data, converting the Timestamp
  return {
    ...docSnap.data(), // Spread document data
    timestamp: docSnap.data().timestamp.toDate(), // Convert Timestamp to Date
  };
}

// Function intended to set up a real-time listener for a single restaurant document
export function getRestaurantSnapshotById(restaurantId, cb) {
  return; // Currently a stub, does nothing
}

// Asynchronously fetches all reviews (ratings) for a given restaurant (one-time fetch)
export async function getReviewsByRestaurantId(db, restaurantId) {
  // Check for a valid restaurant ID before proceeding
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  // Build a query for the 'ratings' subcollection, ordered by timestamp
  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"), // Target the subcollection
    orderBy("timestamp", "desc") // Sort newest first
  );

  // Execute the one-time query fetch
  const results = await getDocs(q);
  // Map the array of review snapshots to an array of clean data objects
  return results.docs.map((doc) => {
    return {
      id: doc.id, // Include the review document ID
      ...doc.data(), // Spread all review fields
      timestamp: doc.data().timestamp.toDate(), // Convert Timestamp to Date
    };
  });
}

// Sets up a real-time listener (snapshot) for all reviews for a given restaurant
export function getReviewsSnapshotByRestaurantId(restaurantId, cb) {
  // Check for a valid restaurant ID before proceeding
  if (!restaurantId) {
    console.log("Error: Invalid restaurantId received: ", restaurantId);
    return;
  }

  // Build a query for the 'ratings' subcollection, ordered by timestamp
  const q = query(
    collection(db, "restaurants", restaurantId, "ratings"), // Target the subcollection
    orderBy("timestamp", "desc") // Sort newest first
  );
  // Attach the real-time listener to the query
  return onSnapshot(q, (querySnapshot) => {
    // Map the document snapshots from the new data (querySnapshot)
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id, // Include the review document ID
        ...doc.data(), // Spread all review fields
        timestamp: doc.data().timestamp.toDate(), // Convert Timestamp to Date
      };
    });
    cb(results); // Call the provided callback function with the new results
  });
}

// -----------------------------------------------------------------------------
// DATA SEEDING FUNCTION
// -----------------------------------------------------------------------------

// Asynchronously adds sample restaurant and review data to the database
export async function addFakeRestaurantsAndReviews() {
  // Generate the fake structured data (restaurants and associated ratings)
  const data = await generateFakeRestaurantsAndReviews();
  // Loop through each restaurant and its associated ratings
  for (const { restaurantData, ratingsData } of data) {
    try {
      // Add the main restaurant document to the 'restaurants' collection
      const docRef = await addDoc(
        collection(db, "restaurants"),
        restaurantData // The data for the restaurant
      );

      // Loop through the ratings data for the newly created restaurant
      for (const ratingData of ratingsData) {
        // Add each rating document to the 'ratings' subcollection under the restaurant
        await addDoc(
          collection(db, "restaurants", docRef.id, "ratings"), // Subcollection path
          ratingData // The data for the individual rating
        );
      }
    } catch (e) {
      // Log a friendly message if an error occurs during seeding
      console.log("There was an error adding the document");
      // Log the detailed error object to the console
      console.error("Error adding document: ", e);
    }
  }
}
