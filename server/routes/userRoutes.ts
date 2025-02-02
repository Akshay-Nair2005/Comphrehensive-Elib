import express from "express";
import {
    createUser
   
} from "../controller/userController";

const router = express.Router();

// Route to fetch all chapters
// router.get("/", getAllChapters);

// // Route to fetch a specific chapter by ID
// router.get("/:id", getChapterById);

// Route to create a new chapter
router.post("/", createUser);

export default router;
