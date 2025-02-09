import type { Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import { ID,Query } from "appwrite";

export const getAllChapters = async (req: Request, res: Response) => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_CHAPTERS || "";

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
        const { Chapter_title, Chapter_content, hostedBookId } = req.body;
        console.log(req.body);

        // Validate required fields
        if (!Chapter_title || !Chapter_content || !hostedBookId) {
            res.status(400).json({ error: "Chapter title, content, and hostedBookId are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "";
        const chaptersCollectionId = process.env.VITE_COLLECTION_ID_CHAPTERS || "";
        const hostedBooksCollectionId = process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || "";
        const chapterId = ID.unique();

        // Step 1: Create the Chapter
        const chapterResponse = await databases.createDocument(
            databaseId,
            chaptersCollectionId,
            chapterId,
            {
                Chapter_title,
                Chapter_content,
            }
        );

        // Step 2: Get the existing chapters array from the hosted book
        const hostedBook = await databases.getDocument(
            databaseId,
            hostedBooksCollectionId,
            hostedBookId
        );

        const existingChapters = hostedBook.chapters || [];

        // Step 3: Append the new chapter ID to the existing array
        const updatedChapters = [...existingChapters, chapterId];

        // Step 4: Update the hosted book document with the new chapters array
        await databases.updateDocument(
            databaseId,
            hostedBooksCollectionId,
            hostedBookId,
            {
                chapters: updatedChapters,
            }
        );

        // Respond with the created chapter
        res.status(201).json({
            message: "Chapter created and linked to hosted book successfully.",
            chapter: chapterResponse,
        });
    } catch (error) {
        console.error("Error creating chapter:", error);
        res.status(500).json({ error: "Failed to create chapter." });
    }
};
