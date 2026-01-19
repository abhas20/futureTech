import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        selectedOption: { type: Number },
        isCorrect: { type: Boolean },
        correctOption: { type: Number }
      },
    ],
  },
  { timestamps: true },
);

// Compound index to ensure a student can't retake the same quiz indefinitely (optional)
// quizResultSchema.index({ studentId: 1, quizId: 1 });

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
export default QuizResult;