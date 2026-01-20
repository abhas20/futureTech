import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaRobot, FaPaperPlane, FaMagic } from "react-icons/fa";

const LectureAIWidget = ({ lectureId }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const fetchSummary = async () => {
    try {
      setSummary(""); // 1. Clear old data immediately so UI doesn't show stale text
      setLoading(true); // 2. Show loader

      const { data } = await axios.post(
        `${serverUrl}/api/summary/generate-summary`,
        { lectureId },
        { withCredentials: true },
      );
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSummary("Summary generation failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- THE FIX ---
  // Re-run this effect whenever 'lectureId' changes OR 'activeTab' changes
  useEffect(() => {
    // 1. Reset chat history when switching lectures
    setMessages([]);
    setQuestion("");

    // 2. Fetch summary if we are on the summary tab
    if (activeTab === "summary") {
      fetchSummary();
    }
  }, [lectureId, activeTab]);
  // ^ Added lectureId dependency so it triggers on lecture switch

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setAsking(true);

    try {
      const { data } = await axios.post(`${serverUrl}/api/summary/askdoubt`, {
        lectureId,
        question: userMsg.text,
      },{
        withCredentials:true
      });
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I encountered an error answering that." },
      ]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
      {/* Header / Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === "summary"
              ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}>
          <FaMagic className="inline mb-1 mr-2" /> Summary
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === "chat"
              ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}>
          <FaRobot className="inline mb-1 mr-2" /> AI Tutor
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/30">
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-4 animate-fadeIn">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-3 text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                <p className="text-xs font-medium">
                  Transcribing & Summarizing...
                </p>
              </div>
            ) : (
              <div className="prose prose-sm prose-indigo max-w-none text-gray-700">
                {summary ? (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </p>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-sm mb-3">
                      No summary available.
                    </p>
                    <button
                      onClick={fetchSummary}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition">
                      Retry Generation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="text-center py-8 opacity-50">
                  <FaRobot className="text-4xl mx-auto mb-2 text-indigo-300" />
                  <p className="text-xs text-gray-500">
                    Ask me anything about this lecture!
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {asking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAskDoubt} className="relative mt-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a doubt..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm shadow-sm"
              />
              <button
                type="submit"
                disabled={asking || !question.trim()}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};



export default LectureAIWidget;
