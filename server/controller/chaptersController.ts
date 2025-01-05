import type { Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import { ID } from "appwrite";

export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_CHAPTERS_COLLECTION_ID || "";

        const response = await databases.listDocuments(databaseId, collectionId);
        res.json(response.documents);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).json({ error: "Failed to fetch chapters" });
    }
};

export const getChapterById = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id || "";
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_CHAPTERS_COLLECTION_ID || "";

        const response = await databases.getDocument(databaseId, collectionId, documentId);
        res.json(response);
    } catch (error) {
        console.error("Error fetching chapter by ID:", error);
        res.status(500).json({ error: "Failed to fetch chapter details" });
    }
};

export const createChapter = async (req: Request, res: Response) => {
    try {
        const { Chapter_title, Chapter_content } = req.body;

        if (!Chapter_title || !Chapter_content) {
            res.status(400).json({ error: "Chapter title and content are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_CHAPTERS_COLLECTION_ID || "";

        const response = await databases.createDocument(databaseId, collectionId, ID.unique(), {
            Chapter_title,
            Chapter_content,
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ error: "Failed to create chapter" });
    }
};
