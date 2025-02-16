import type { Request, Response } from "express";
import { users, databases } from "../services/appwriteClient";
import {  ID } from "appwrite";


export const createContributions = async (req: Request, res: Response) => {
  try {
    const {
      userid,
      hostedBooksId,
      userName,
      hostedBookName,
      authorName,
      chaptertitle,
      chaptercontent,
    } = req.body;

    if (
      !userid ||
      !hostedBooksId ||
      !userName ||
      !hostedBookName ||
      !authorName ||
      !chaptertitle ||
      !chaptercontent
    ) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    const databaseId = process.env.VITE_DATABASE || "";
    const collectionIdContributions =
      process.env.VITE_COLLECTION_ID_CONTRIBUTIONS || "";
    const collectionIdHostedBooks =
      process.env.VITE_COLLECTION_ID_HOSTEDBOOKS || "";

    // Step 1: Create the contribution document
    const contribution = await databases.createDocument(
      databaseId,
      collectionIdContributions,
      ID.unique(),
      {
        userid,
        hostedbooksid: hostedBooksId,
        username: userName,
        hostedbookname: hostedBookName,
        author_name: authorName,
        chaptertitle,
        chapter_content: chaptercontent,
      }
    );

    // Step 2: Fetch the existing hosted book document
    const hostedBook = await databases.getDocument(
      databaseId,
      collectionIdHostedBooks,
      hostedBooksId
    );

    const existingContributions = hostedBook.contributions || [];

    // Step 3: Update the hosted book document by adding the contribution ID
    await databases.updateDocument(
      databaseId,
      collectionIdHostedBooks,
      hostedBooksId,
      {
        contributions: [...existingContributions, contribution.$id], // Append new contribution ID
      }
    );

    res.status(201).json({
      message: "Contribution created and hosted book updated successfully!",
      contribution,
    });
  } catch (error) {
    console.error("Error creating contribution:", error);
    res.status(500).json({ error: "Failed to create Contribution Document" });
  }
};

  