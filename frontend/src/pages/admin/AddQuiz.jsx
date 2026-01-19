

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTrash, FaClock } from "react-icons/fa";

export default function AddQuiz({ editData }) {
  const { lectureId, courseId, quizId } = useParams();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: 0, explanation: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState(10);

  /* ================= SYNC EDIT DATA ================= */
  useEffect(() => {
    if (!editData) return;
    setQuizTitle(editData.quizTitle || "");
    setDuration(editData.duration || 10);
    setQuestions(
      editData.questions?.length
        ? editData.questions
        : [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }],
    );
  }, [editData]);

  /* ================= HANDLERS ================= */
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOption: 0, explanation: "" },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.error("At least one question is required");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    for (const q of questions) {
      if (!q.questionText.trim()) {
        toast.error("All questions must have text");
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        toast.error("All options must be filled");
        return;
      }
    }

    try {
      setSaving(true);

      const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation || "",
      }));

      if (quizId) {
        await axios.put(
          `${serverUrl}/api/quiz/${quizId}`,
          { quizTitle, duration, questions: formattedQuestions },
          { withCredentials: true },
        );
        toast.success("Quiz Updated");
      } else {
        await axios.post(
          `${serverUrl}/api/quiz`,
          {
            quizTitle,
            lectureId,
            courseId,
            duration,
            questions: formattedQuestions,
          },
          { withCredentials: true },
        );
        toast.success("Quiz Created");
      }

      navigate(`/editlecture/${courseId}/${lectureId}`);
    } catch {
      toast.error("Quiz Save Failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async () => {
    if (!quizId) return;
    if (!window.confirm("Delete this quiz permanently?")) return;

    try {
      await axios.delete(`${serverUrl}/api/quiz/${quizId}`, {
        withCredentials: true,
      });
      toast.success("Quiz Deleted");
      navigate(`/editlecture/${courseId}/${lectureId}`);
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition"
            >
              <FaArrowLeft /> Back
            </button>

            {quizId && (
              <button
                onClick={deleteQuiz}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition font-semibold"
              >
                <FaTrash /> Delete Quiz
              </button>
            )}
          </div>

          {/* Title + Duration */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-800">
              {quizId ? "Edit Quiz" : "Create Quiz"}
            </h2>

            <div className="flex items-center gap-3 bg-indigo-100 border border-indigo-200 px-5 py-3 rounded-full text-indigo-700 shadow-sm">
              <FaClock />
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-20 bg-transparent outline-none text-center font-bold"
              />
              <span className="text-sm">minutes</span>
            </div>
          </div>

          {/* Quiz Title */}
          <input
            className="w-full bg-white border border-gray-200 p-4 rounded-xl mb-8 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 text-lg"
            placeholder="Enter Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          {/* Questions */}
          <div className="space-y-8">
            {questions.map((q, i) => (
              <div
                key={i}
                className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow hover:shadow-lg transition"
              >
                {/* Question Badge */}
                <span className="absolute -top-4 -left-4 bg-yellow-400 text-black font-bold px-4 py-1 rounded-full shadow">
                  Q{i + 1}
                </span>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-700 font-semibold">
                    Question {i + 1}
                  </h3>
                  <button
                    onClick={() => removeQuestion(i)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>

                <input
                  className="w-full border border-gray-200 p-3 rounded-lg mb-4"
                  placeholder="Enter question text"
                  value={q.questionText}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[i].questionText = e.target.value;
                    setQuestions(copy);
                  }}
                />

                {q.options.map((op, oi) => (
                  <div
                    key={oi}
                    className={`flex items-center gap-3 mb-3 p-3 rounded-xl transition
                      ${
                        q.correctOption === oi
                          ? "bg-green-100 border border-green-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`correct-${i}`}
                      checked={q.correctOption === oi}
                      onChange={() => {
                        const copy = [...questions];
                        copy[i].correctOption = oi;
                        setQuestions(copy);
                      }}
                    />
                    <input
                      className="bg-transparent outline-none w-full"
                      placeholder={`Option ${oi + 1}`}
                      value={op}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[i].options[oi] = e.target.value;
                        setQuestions(copy);
                      }}
                    />
                  </div>
                ))}
          <input
            className="border p-2 w-full rounded mt-2"
            placeholder={`Explanation for Question ${i + 1}`}
            value={q.explanation}
            onChange={(e) => {
              const copy = [...questions];
              copy[i].explanation = e.target.value;
              setQuestions(copy);
            }}
          />
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={addQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
            >
              + Add Question
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveQuiz}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Quiz"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
