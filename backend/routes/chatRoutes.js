import express from "express";
import CourseChat from "../models/CourseChat.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/:courseId", isAuth, async (req, res) => {
  const chats = await CourseChat.find({ courseId: req.params.courseId })
    .populate("sender", "name photoUrl")
    .sort({ createdAt: 1 });

  res.json(chats);
});

export default router;