import express from "express";
import {
  getMathTopics,
  getMathTopicsByDifficulty,
  getMathProblems,
  checkAnswer
} from "../controllers/math.controller.js";

const router = express.Router();

router.get("/topics", getMathTopics);
router.get("/topics/:difficulty", getMathTopicsByDifficulty);
router.get("/problems/:topic_id", getMathProblems);

// ✅ same controller handles everything
router.get("/check-answer", checkAnswer);
router.post("/check-answer", checkAnswer);

export default router;
