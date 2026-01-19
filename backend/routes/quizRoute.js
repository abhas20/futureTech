import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  createQuiz,
  getQuizByLecture,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getCourseQuizzes,
  getQuizAttempt,
  getStudentPerformance,
} from "../controllers/quizController.js";

const quizRouter = express.Router();

// TEMP: everyone logged-in can manage quiz
quizRouter.post("/", isAuth, createQuiz);
quizRouter.put("/:quizId", isAuth, updateQuiz);
quizRouter.delete("/:quizId", isAuth, deleteQuiz);
quizRouter.get("/:lectureId", isAuth, getQuizByLecture);
quizRouter.post("/:quizId/submit", isAuth, submitQuiz);
quizRouter.get("/course/:courseId", isAuth, getCourseQuizzes);
quizRouter.get("/:quizId/attempt", isAuth, getQuizAttempt);
quizRouter.get("/user/analytics", isAuth, getStudentPerformance);

export default quizRouter;
