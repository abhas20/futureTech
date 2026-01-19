import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

export default function CourseAIChat({ courseId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const res = await axios.post(
      `${serverUrl}/api/chatai/ask`,
      { question, courseId },
      { withCredentials: true }
    );

    setAnswer(res.data.answer);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg mt-8">
      <h3 className="font-bold text-lg mb-3">🤖 Course AI Tutor</h3>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything from lecture notes..."
        className="w-full border rounded-xl p-3 mb-3"
      />

      <button
        onClick={askAI}
        className="bg-black text-white px-6 py-2 rounded-xl"
      >
        Ask AI
      </button>

      {loading && <p className="mt-3">Thinking...</p>}
      {answer && <p className="mt-4 text-gray-700">{answer}</p>}
    </div>
  );
}