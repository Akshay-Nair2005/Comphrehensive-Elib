import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./Routes"; // Import the routes
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    // The RouterProvider will handle routing
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  );
}

export default App;
