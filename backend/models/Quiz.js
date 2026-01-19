import mongoose from "mongoose";

/* Question schema */
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: (v) => v.length === 4,
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation:{
    type: String,
  },

  attemptCount: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
});

/* Quiz schema */
const quizSchema = new mongoose.Schema(
  {
    quizTitle: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      unique: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: (v) => v.length > 0, 
    },
    duration: {
      type: Number,
      default: 10,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalAttempts: {
      type: Number,
      default: 0,
    },
    totalScoreSum: {
      type: Number,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
