import type { Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import { Query, ID } from "appwrite";

export const getAllCustomBooks = async (req: Request, res: Response) => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_CUSTOMBOOKS || "";

        const response = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);
        res.json(response.documents);
    } catch (error) {
        console.error("Error fetching custom books:", error);
        res.status(500).json({ error: "Failed to fetch custom books" });
    }
};

export const getCustomBookById = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id || "";
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_CUSTOMBOOKS || "";

        const response = await databases.getDocument(databaseId, collectionId, documentId);
        res.json(response);
    } catch (error) {
        console.error("Error fetching custom book by ID:", error);
        res.status(500).json({ error: "Failed to fetch custom book details" });
    }
};

export const createCustomBook = async (req: Request, res: Response) => {
    try {
        const { title, genre, description, author } = req.body;

        if (!title || !genre || !description || !author) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_CUSTOMBOOKS || "";

        const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
            title,
            genre,
            description,
            author,
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating custom book:", error);
        res.status(500).json({ error: "Failed to create custom book" });
    }
};
