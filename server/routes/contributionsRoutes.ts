import express from "express";
import { createContributions } from "../controller/contributionsController";

const router = express.Router();

router.post("/",createContributions); 

export default router;