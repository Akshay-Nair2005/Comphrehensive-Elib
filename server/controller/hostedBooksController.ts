import type{ Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import { Query, ID } from "appwrite";

export const getAllHostedBooks = async (req: Request, res: Response) => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || "";

        const response = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);
        res.json(response.documents);
    } catch (error) {
        console.error("Error fetching hosted books:", error);
        res.status(500).json({ error: "Failed to fetch hosted books" });
    }
};

export const getHostedBookById = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id || "";
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || "";

        const response = await databases.getDocument(databaseId, collectionId, documentId);
        res.json(response);
    } catch (error) {
        console.error("Error fetching hosted book by ID:", error);
        res.status(500).json({ error: "Failed to fetch hosted book details" });
    }
};

export const createHostedBook = async (req: Request, res: Response) => {
    try {
        const { hbook_name, hbook_genre, hbook_desc, hbook_author, hbook_authdesc, hbook_novelimg } = req.body;

        if (!hbook_name || !hbook_genre || !hbook_desc || !hbook_author) {
            res.status(400).json({ error: "All fields except novel image are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || "";

        const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
            hbook_name,
            hbook_genre,
            hbook_desc,
            hbook_author,
            hbook_authdesc,
            hbook_novelimg: hbook_novelimg || "",
            chapters: [],
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating hosted book:", error);
        res.status(500).json({ error: "Failed to create hosted book" });
    }
};
