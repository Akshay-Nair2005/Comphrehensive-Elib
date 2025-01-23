import { Router } from "express";
import { getAllHostedBooks, getHostedBookById, createHostedBook } from "../controller/hostedBooksController";

const router = Router();

router.get("/", getAllHostedBooks);
router.get("/:id", getHostedBookById);
router.post("/", createHostedBook);
// router.put("/:id", createHostedBook);

export default router;
