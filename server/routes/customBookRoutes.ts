import express from "express";
import {
    getAllCustomBooks,
    getCustomBookById,
    createCustomBook,
} from "../controller/customBooksController";

const router = express.Router();

// Route to fetch all custom books
router.get("/", getAllCustomBooks);

// Route to fetch a specific custom book by ID
router.get("/:id", getCustomBookById);

// Route to create a new custom book
router.post("/", createCustomBook);

export default router;
