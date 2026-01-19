import express from "express";
import { askCourseAI } from "../controllers/aiChatController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/ask", isAuth, askCourseAI);

export default router;