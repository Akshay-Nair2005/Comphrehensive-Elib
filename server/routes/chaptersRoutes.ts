import express from "express";
import {
    getAllChapters,
    getChapterById,
    createChapter,
} from "../controller/chaptersController";

const router = express.Router();

// Route to fetch all chapters
router.get("/", getAllChapters);

// Route to fetch a specific chapter by ID
router.get("/:id", getChapterById);

// Route to create a new chapter
router.post("/", createChapter);

export default router;
