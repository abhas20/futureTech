import express from "express";
import { askCourseAI } from "../controllers/aiChatController.js";
import isAuth from "../middlewares/isAuth.js";
import AICourseChat from "../models/AICourseChat.js";

const router = express.Router();

router.post("/ask", isAuth, askCourseAI);

router.get("/history/:courseId", isAuth, async (req, res) => {
  const chat = await AICourseChat.findOne({
    courseId: req.params.courseId,
    userId: req.userId,
  });

  res.json(chat?.messages || []);
});

export default router;