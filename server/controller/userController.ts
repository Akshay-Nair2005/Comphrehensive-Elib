import type { Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import {  ID } from "appwrite";


export const createUser = async (req: Request, res: Response) => {
    try {
        const { id,User_name,User_Status,User_desc} = req.body;

        if (!id || !User_name || !User_Status || !User_desc) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }

        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_USER || "";

        const response = await databases.createDocument(databaseId, collectionId, id, {      
            User_desc,
            User_Status,
            hostedbooks : [],
            custombooks : [],
            User_name,
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating User:", error);
        res.status(500).json({ error: "Failed to create User" });
    }
};