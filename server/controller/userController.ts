import type { Request, Response } from "express";
import { databases } from "../services/appwriteClient";
import {  ID } from "appwrite";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_USER || "";

        const response = await databases.listDocuments(databaseId, collectionId);
        res.json(response.documents);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).json({ error: "Failed to fetch chapters" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const documentId = req.params.id || "";
        const databaseId = process.env.VITE_DATABASE || "";
        const collectionId = process.env.VITE_COLLECTION_ID_USER || "";

        const response = await databases.getDocument(databaseId, collectionId, documentId);
        res.json(response);
    } catch (error) {
        console.error("Error fetching user  by ID:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};

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
            createdhostedbooks : [],
        });

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating User:", error);
        res.status(500).json({ error: "Failed to create User" });
    }
};


export const updateUserBooks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ✅ Extract ID from URL params
    const { custombooks } = req.body; // ✅ Extract updated books from request body

    if (!id || !custombooks) {
      return res.status(400).json({ error: "User ID and book list are required" });
    }

    const databaseId = process.env.VITE_DATABASE || "";
    const userCollectionId = process.env.VITE_COLLECTION_ID_USER || "";

    // 🔹 Fetch user document
    const user = await databases.getDocument(databaseId, userCollectionId, id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Update the user's custombooks list
    const response = await databases.updateDocument(databaseId, userCollectionId, id, {
      custombooks:custombooks,
    });

    return res.json(response);
  } catch (error) {
    console.error("Error updating user books:", error);
    return res.status(500).json({ error: "Failed to update user books" });
  }
};

export const updateUserHbooks = async (req: Request, res: Response) => {
  try {
    const { hid } = req.params; // ✅ Extract ID from URL params
    const { hostedbooks } = req.body; // ✅ Extract updated books from request body

    if (!hid || !hostedbooks) {
      return res.status(400).json({ error: "User ID and book list are required" });
    }

    const databaseId = process.env.VITE_DATABASE || "";
    const userCollectionId = process.env.VITE_COLLECTION_ID_USER || "";

    // 🔹 Fetch user document
    const user = await databases.getDocument(databaseId, userCollectionId, hid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Update the user's custombooks list
    const response = await databases.updateDocument(databaseId, userCollectionId, hid, {
      hostedbooks:hostedbooks,
    });

    return res.json(response);
  } catch (error) {
    console.error("Error updating user books:", error);
    return res.status(500).json({ error: "Failed to update user books" });
  }
};


export const deleteUserBooks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // User ID
    const { bookId, type } = req.body; // Book ID and type (custom or hosted)

    const databaseId = process.env.VITE_DATABASE || "";
    const userCollectionId = process.env.VITE_COLLECTION_ID_USER || "";

    // Fetch user document
    const user = await databases.getDocument(databaseId, userCollectionId, id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the book from the appropriate list
    const updatedBooks = type === "custom"
      ? user.custombooks.filter((book: any) => book.$id !== bookId)
      : user.hostedbooks.filter((book: any) => book.$id !== bookId);

    // Update user document
    const updatedUser = await databases.updateDocument(databaseId, userCollectionId, id, {
      [type === "custom" ? "custombooks" : "hostedbooks"]: updatedBooks,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(500).json({ error: "Failed to delete book" });
  }
};

export const usernamedesc = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params; // ✅ Extract ID from URL params
    const { name,desc } = req.body; // ✅ Extract updated books from request body

    if (!uid || !name || !desc) {
      return res.status(400).json({ error: "User ID and book list are required" });
    }

    const databaseId = process.env.VITE_DATABASE || "";
    const userCollectionId = process.env.VITE_COLLECTION_ID_USER || "";

    // 🔹 Fetch user document
    const user = await databases.getDocument(databaseId, userCollectionId, uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔹 Update the user's custombooks list
    const response = await databases.updateDocument(databaseId, userCollectionId, uid, {
      User_name:name,
      User_desc:desc,
    });

    return res.json(response);
  } catch (error) {
    console.error("Error updating user books:", error);
    return res.status(500).json({ error: "Failed to update user books" });
  }
};
