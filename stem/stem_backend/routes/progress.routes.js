import express from "express";
import {
  saveProgress,
  getProgress
} from "../controllers/progress.controller.js";

const router = express.Router();

router.post("/", saveProgress);
router.get("/:user_id", getProgress);

export default router;
