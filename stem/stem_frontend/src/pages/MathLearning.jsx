import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BookOpen, Calculator, Award } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MathLearning() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [difficulty]);

  const fetchTopics = async () => {
    try {
      const endpoint = difficulty === "all" ? `${API}/math/topics` : `${API}/math/topics/${difficulty}`;
      const response = await axios.get(endpoint);
      setTopics(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setLoading(false);
    }
  };

  const selectTopic = async (topic) => {
    setSelectedTopic(topic);
    try {
      const response = await axios.get(`${API}/math/problems/${topic._id}`);
      setProblems(response.data);
      setCurrentProblem(0);
      setUserAnswer("");
      setShowResult(false);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please enter an answer!");
      return;
    }

    try {
      const problem = problems[currentProblem];
      const response = await axios.post(`${API}/math/check-answer?problem_id=${problem._id}&user_answer=${encodeURIComponent(userAnswer)}`);
      setResult(response.data);
      setShowResult(true);

      if (response.data.correct) {
        toast.success("Correct! Great job! 🎉");
      } else {
        toast.error("Not quite right. Try again!");
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      toast.error("Error checking answer");
    }
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setUserAnswer("");
      setShowResult(false);
      setResult(null);
    } else {
      toast.success("You've completed all problems! 🌟");
      setSelectedTopic(null);
      setProblems([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots flex gap-2">
          <span className="w-3 h-3 bg-primary rounded-full"></span>
          <span className="w-3 h-3 bg-primary rounded-full"></span>
          <span className="w-3 h-3 bg-primary rounded-full"></span>
        </div>
      </div>
    );
  }

  // console.log(topics)
  // console.log(currentProblem)

  return (
    <div className="min-h-screen pb-20" data-testid="math-learning-page">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-b-2 border-slate-100">
        <div className="container mx-auto px-6 md:px-12 py-8">
          <Button
            data-testid="back-button"
            onClick={() => navigate("/")}
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl px-4 py-2 font-bold mb-4"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="page-heading">Math Explorer</h1>
              <p className="text-lg font-medium text-slate-600 mt-1">Practice and master math skills!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-8">
        {!selectedTopic ? (
          <>
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-4 mb-8" data-testid="difficulty-filter">
              {["all", "easy", "medium", "hard"].map((level) => (
                <Button
                  key={level}
                  data-testid={`difficulty-${level}`}
                  onClick={() => setDifficulty(level)}
                  className={`h-12 px-6 rounded-full font-bold transition-all ${
                    difficulty === level
                      ? "bg-primary text-white shadow-[0_4px_0_0_rgba(79,70,229,1)] active:shadow-none active:translate-y-[4px]"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-primary"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <div
                  key={topic._id}
                  data-testid={`topic-card-${topic._id}`}
                  onClick={() => selectTopic(topic)}
                  className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 cursor-pointer active:scale-95"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" strokeWidth={2.5} />
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        topic.difficulty === "easy"
                          ? "bg-green-100 text-green-700"
                          : topic.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {topic.difficulty}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
                  <p className="text-slate-600 font-medium">{topic.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Problem Solving Interface */}
            <div className="max-w-3xl mx-auto">
              <Button
                data-testid="back-to-topics-button"
                onClick={() => setSelectedTopic(null)}
                className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl px-4 py-2 font-bold mb-6"
                variant="ghost"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Topics
              </Button>

              <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedTopic.title}</h2>
                  <div className="text-slate-600 font-bold">
                    Problem {currentProblem + 1} of {problems.length}
                  </div>
                </div>

                {problems.length > 0 && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 rounded-2xl p-6 border-2 border-indigo-100">
                      <p className="text-2xl font-bold text-slate-800" data-testid="problem-question">
                        {problems[currentProblem].question}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Answer:</label>
                      <input
                        data-testid="answer-input"
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !showResult && checkAnswer()}
                        disabled={showResult}
                        className="h-12 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 font-medium focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none w-full"
                        placeholder="Type your answer here..."
                      />
                    </div>

                    {!showResult ? (
                      <Button
                        data-testid="check-answer-button"
                        onClick={checkAnswer}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-bold shadow-[0_4px_0_0_rgba(79,70,229,1)] active:shadow-none active:translate-y-[4px] transition-all w-full"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div
                          className={`rounded-2xl p-6 border-2 ${
                            result.correct
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {result.correct ? (
                              <Award className="h-8 w-8 text-green-600" />
                            ) : (
                              <BookOpen className="h-8 w-8 text-red-600" />
                            )}
                            <h3 className="text-xl font-bold">
                              {result.correct ? "Correct!" : "Not Quite Right"}
                            </h3>
                          </div>
                          <p className="font-medium text-slate-700 mb-2">
                            <strong>Answer:</strong> {result.answer}
                          </p>
                          <p className="font-medium text-slate-600">{result.explanation}</p>
                        </div>
                        <Button
                          data-testid="next-problem-button"
                          onClick={nextProblem}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 rounded-full font-bold shadow-[0_4px_0_0_rgba(101,163,13,1)] active:shadow-none active:translate-y-[4px] transition-all w-full"
                        >
                          Next Problem
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
