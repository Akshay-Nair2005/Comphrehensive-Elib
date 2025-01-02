import express from "express";
import { Client, Databases, ID, Query } from "appwrite";
import dotenv from "dotenv";
// import
// import cors from "cors";
import type { Request, Response } from "express";

dotenv.config();

//HIii
const app = express();
const PORT = 5000;

// Enable CORS
const cors = require("cors");
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(`${process.env.VITE_ENDPOINT}`)
    .setProject(`${process.env.VITE_PROJECT_ID}`)
    

const databases = new Databases(client);

// Endpoint to fetch a list of all books
app.get("/books", async (req: Request, res: Response): Promise<void> => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_CUSTOMBOOKS||process.env.VITE_COLLECTION_ID_CUSTOMMBOOKS || " " ;

        // Fetch all books from the collection
        const response = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);

        // Respond with the list of books
        res.json(response.documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Endpoint to fetch a specific book's details by ID
app.get("/books/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const documentId = req.params.id || "";
        const databaseId =`${ process.env.VITE_DATABASE}`;
        const collectionId = `${process.env.VITE_COLLECTION_ID_CUSTOMBOOKS}` || `${process.env.VITE_COLLECTION_ID_HOSTEDBOOKS}` || `${process.env.VITE_COLLECTION_ID_CHAPTERS}` || " ";

        // Fetch the specific document from the database
        const response = await databases.getDocument(databaseId, collectionId, documentId);

        // Respond with the book's data
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch book details" });
    }
});

// Endpoint to fetch a list of all Hosted books
app.get("/hbooks", async (req: Request, res: Response): Promise<void> => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || " " ;

        // Fetch all books from the collection
        const response = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);

        // Respond with the list of books
        res.json(response.documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Endpoint to fetch a specific hosted book's details by ID
app.get("/hbooks/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const documentId = req.params.id || "";
        const databaseId =`${ process.env.VITE_DATABASE}`;
        const collectionId = `${process.env.VITE_COLLECTION_ID_HOSTEDBOOKS}` || " ";

        // Fetch the specific document from the database
        const response = await databases.getDocument(databaseId, collectionId, documentId);

        // Respond with the book's data
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch book details" });
    }
});

// Endpoint to create a new chapter
app.post("/chapters", async (req: Request, res: Response): Promise<void> => {
    try {
        const { Chapter_title, Chapter_content } = req.body;
        console.log("Received request to /chapters", req.body); // Add this line

        if (!Chapter_title || !Chapter_content) {
            res.status(400).json({ error: "Title and content are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "674ad544002c56d61b63";
        const collectionId = process.env.VITE_CHAPTERS_COLLECTION_ID || "6766a81f00338a0c7fc3";

        // Create a new document
        const response = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            { Chapter_title,Chapter_content }
        );

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save chapter." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
