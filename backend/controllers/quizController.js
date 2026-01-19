import Quiz from "../models/Quiz.js";
import Course from "../models/courseModel.js";
import QuizResult from "../models/quizResult.js";

/* ================= CREATE QUIZ ================= */
export const createQuiz = async (req, res) => {
  try {
    const { quizTitle, courseId, lectureId, questions, duration, explanation } =
      req.body;

    if (!quizTitle || !courseId || !lectureId || !questions || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecture = course.lectures.find((l) => l._id.toString() === lectureId);
    if (!lecture)
      return res
        .status(404)
        .json({ message: "Lecture not found in this course" });

    const existingQuiz = await Quiz.findOne({ lectureId });
    if (existingQuiz)
      return res
        .status(400)
        .json({ message: "Quiz already exists for this lecture" });

    const quiz = await Quiz.create({
      quizTitle,
      courseId,
      lectureId,
      questions,
      duration,
      createdBy: req.userId,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET QUIZ ================= */
export const getQuizByLecture = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lectureId: req.params.lectureId });
    // if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE QUIZ ================= */
export const updateQuiz = async (req, res) => {
  try {
    const { questions, questionsTitle, duration, explanation } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      {
        quizTitle: questionsTitle,
        questions: questions,
        duration: duration,
      },
      {
        new: true,
      },
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE QUIZ ================= */
export const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= SUBMIT QUIZ ================= */

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;
    const { responses } = req.body;

    const quiz = await Quiz.findById(quizId);
    // responses = [{ questionId: "...", selectedOption: 2, isCorrect: true }, ...]
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    const gradedResponses = responses
      .map((response) => {
        const question = quiz.questions.id(response.questionId);

        if (question) {
          const isCorrect = question.correctOption === response.selectedOption;

          if (isCorrect) score++;

          question.attemptCount = (question.attemptCount || 0) + 1;
          if (isCorrect) {
            question.correctCount = (question.correctCount || 0) + 1;
          }

          return {
            questionId: response.questionId,
            selectedOption: response.selectedOption,
            isCorrect: isCorrect,
            correctOption: question.correctOption,
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    quiz.totalAttempts = (quiz.totalAttempts || 0) + 1;
    quiz.totalScoreSum = (quiz.totalScoreSum || 0) + score;
    if (!quiz.highestScore || score > quiz.highestScore) {
      quiz.highestScore = score;
    }

    await quiz.save();

    const newResult = await QuizResult.create({
      studentId: userId,
      quizId: quizId,
      score: score,
      totalQuestions: totalQuestions,
      responses: gradedResponses,
    });

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        score,
        totalQuestions,
        percentage: ((score / totalQuestions) * 100).toFixed(2),
        resultId: newResult._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET COURSE QUIZZES ================= */

export const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({ courseId })
      .populate("lectureId", "lectureTitle")
      .sort({ createdAt: 1 });

    if (!quizzes) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this course" });
    }

    return res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Get Course Quizzes Error:", error);
    return res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

/* ================= GET QUIZ ATTEMPT ================= */

export const getQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;

    const attempt = await QuizResult.findOne({
      quizId: quizId,
      studentId: userId,
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No attempt found",
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Get Quiz Attempt Error:", error);
    return res.status(500).json({ message: "Failed to fetch attempt" });
  }
};

/* ================= GET STUDENT PERFORMANCE ================= */
export const getStudentPerformance = async (req, res) => {
  try {
    const userId = req.userId;

    const results = await QuizResult.find({ studentId: userId })
      .populate("quizId", "quizTitle highestScore totalAttempts totalScoreSum") 
      .sort({ createdAt: 1 });

    const data = results.map((result) => {
      const quiz = result.quizId || {}; // Handle null if quiz deleted
      const quizTitle = quiz.quizTitle || "Deleted Quiz";
      const totalQuestions = result.totalQuestions || 1; // Prevent division by zero

      let classAverage = 0;
      if (quiz.totalAttempts > 0) {
        const avgRawScore = quiz.totalScoreSum / quiz.totalAttempts;
        classAverage = Math.round((avgRawScore / totalQuestions) * 100);
      }
    
      const highestScoreRaw = quiz.highestScore || 0;
      const highestScorePercent = Math.round((highestScoreRaw / totalQuestions) * 100);
      
      return {
        id: result._id,
        quizTitle: quizTitle,
        score: result.score,
        totalQuestions: result.totalQuestions,
        
        percentage: Math.round((result.score / totalQuestions) * 100),
        classAverage: classAverage,
        highestScore: highestScorePercent, 
        
        date: new Date(result.createdAt).toLocaleDateString(),
      };
    });

    const totalQuizzes = results.length;
    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    const maxPossibleScore = results.reduce(
      (acc, curr) => acc + curr.totalQuestions,
      0,
    );
    const avgPercentage =
      maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalQuizzes,
        avgPercentage,
      },
      data: data, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching analytics" });
  }
};