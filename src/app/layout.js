// Import necessary CSS for styling the application
import "@/src/app/styles.css";
// Import the client component that renders the header and handles client-side auth updates
import Header from "@/src/components/Header.jsx";
// Import the function to securely retrieve the authenticated user on the server
// *** CORRECTED: Using serverApp.js to match your file name ***
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js"; 

// Force next.js to treat this route as server-side rendered (SSR)
// Without this line, during the build process, next.js will treat this route as static.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "FriendlyEats",
  description:
    "FriendlyEats is a restaurant review website built with Next.js and Firebase.",
};

// RootLayout is an async Server Component
export default async function RootLayout({ children }) {
  // Call the server-side function to get the current authenticated user from the session cookie.
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        {/* Pass the serialized user object to the Header component.
            This allows the Header to render the user's name/photo immediately on the server.
            We use toJSON() to safely serialize the complex User object for client consumption.
        */}
        <Header initialUser={currentUser?.toJSON()} />

        {/* This is where the rest of your page content will be rendered */}
        <main>{children}</main>
      </body>
    </html>
  );
}
