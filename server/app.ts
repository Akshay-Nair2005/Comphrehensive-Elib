import express from "express";
import { applyMiddlewares } from "./middleware/corsMiddleware"; // Import middleware
import hostedBooksRoutes from "./routes/hostedBookRoutes";
import customBooksRoutes from "./routes/customBookRoutes";
import chaptersRoutes from "./routes/chaptersRoutes";
import userRoutes from "./routes/userRoutes";
import contributionsRoutes from "./routes/contributionsRoutes";

const app = express();

// Apply middlewares
applyMiddlewares(app);

// Define routes
app.use("/hbooks", hostedBooksRoutes);
app.use("/books", customBooksRoutes);
app.use("/chapters", chaptersRoutes);
app.use("/user", userRoutes);
app.use("/contributions", contributionsRoutes  );

export default app;
