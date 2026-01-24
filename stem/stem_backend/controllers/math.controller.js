import MathTopic from "../models/MathTopic.js";
import MathProblem from "../models/MathProblem.js";

export const getMathTopics = async (req, res) => {
  res.json(await MathTopic.find());
};

export const getMathTopicsByDifficulty = async (req, res) => {
  res.json(
    await MathTopic.find({ difficulty: req.params.difficulty })
  );
};

export const getMathProblems = async (req, res) => {
  res.json(
    await MathProblem.find({ topic_id: req.params.topic_id })
  );
};

/* Handles BOTH GET and POST */
export const checkAnswer = async (req, res) => {
  const problem_id = req.query.problem_id || req.body.problem_id;

  const user_answer = req.query.user_answer || req.body.user_answer;

  if (!problem_id || !user_answer) {
    return res.status(400).json({
      detail: "problem_id and user_answer are required",
    });
  }

  const problem = await MathProblem.findById(problem_id);

  if (!problem) {
    return res.status(404).json({
      detail: "Problem not found",
    });
  }

  const correct =
    String(user_answer).trim().toLowerCase() ===
    String(problem.answer).trim().toLowerCase();

  return res.json({
    correct,
    answer: problem.answer,
    explanation: problem.explanation,
  });
};
