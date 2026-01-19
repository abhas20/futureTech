import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

export default function CourseAIChat({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiOffline, setAiOffline] = useState(false); // 🆕

  // 🔁 Load chat history on refresh
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/chatai/history/${courseId}`, {
        withCredentials: true,
      })
      .then(res => setMessages(res.data))
      .catch(() => {});
  }, [courseId]);

  const sendMessage = async () => {
    if (!text.trim() || aiOffline) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/chatai/ask`,
        { question: userMsg.content, courseId },
        { withCredentials: true }
      );

      const answer = res.data.answer;

      // 🚨 Detect AI offline
      if (answer?.includes("AI is currently unavailable")) {
        setAiOffline(true);
      }

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ AI failed to respond. Try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg mt-8 border">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">🤖 Course AI Tutor</h3>

        {aiOffline && (
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
            AI Offline
          </span>
        )}
      </div>

      {/* CHAT */}
      <div className="h-64 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] text-sm ${
              m.role === "user"
                ? "bg-black text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={aiOffline}
        placeholder={
          aiOffline
            ? "AI is offline on this server"
            : "Ask from lecture notes..."
        }
        className={`w-full border rounded-xl p-3 mb-3 text-sm ${
          aiOffline ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />

      <button
        onClick={sendMessage}
        disabled={aiOffline || loading}
        className={`px-6 py-2 rounded-xl text-white font-medium transition ${
          aiOffline
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-blue-600"
        }`}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
    </div>
  );
}