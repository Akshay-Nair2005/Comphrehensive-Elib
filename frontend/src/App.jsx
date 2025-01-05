// App.js
import React from "react";
import { RouterProvider } from "react-router-dom";
import ScrollToTop from "../src/components/ScrollToTop"; // Import the ScrollToTop component
import { routes } from "./Routes"; // Import the routes from routes.js

function App() {
  return (
    <RouterProvider router={routes}>
      {/* ScrollToTop should be inside the RouterProvider to ensure it can react to route changes */}
      <ScrollToTop />
    </RouterProvider>
  );
}

export default App;
