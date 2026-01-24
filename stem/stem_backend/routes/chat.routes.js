import express from "express";
import {
  chatWithTutor,
  getChatHistory
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", chatWithTutor);
router.get("/history/:session_id", getChatHistory);

export default router;
