import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AITutor() {
  const navigate = useNavigate();
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/chat/history/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      toast.error("Please type a message!");
      return;
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      session_id: sessionId,
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: input
      });

      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        session_id: sessionId,
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How does photosynthesis work?",
    "Explain multiplication in simple terms",
    "What is gravity?",
    "How do acids and bases work?"
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="ai-tutor-page">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b-2 border-slate-100">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <Button
            data-testid="back-button"
            onClick={() => navigate("/")}
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl px-4 py-2 font-bold mb-4"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="page-heading">AI Tutor</h1>
              <p className="text-lg font-medium text-slate-600 mt-1">Ask me anything about science and math!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-6 md:px-12 py-8 flex flex-col max-w-4xl">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">Hi! I'm your AI Tutor!</h2>
              <p className="text-lg text-slate-600 font-medium">
                Ask me about math, chemistry, physics, or anything you're curious about!
              </p>
            </div>
            <div className="w-full max-w-xl">
              <p className="text-sm font-bold text-slate-500 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    data-testid={`quick-question-${idx}`}
                    onClick={() => setInput(question)}
                    className="bg-white border-2 border-slate-200 hover:border-primary hover:bg-indigo-50 rounded-2xl p-4 text-left text-sm font-medium text-slate-700 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                data-testid={`message-${message.role}`}
                className={`chat-message flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-white border-2 border-slate-100 text-slate-800"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-primary">AI Tutor</span>
                    </div>
                  )}
                  <p className="font-medium whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start chat-message">
                <div className="max-w-[80%] bg-white border-2 border-slate-100 rounded-3xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-sm font-medium text-slate-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg p-4 flex gap-3">
          <input
            data-testid="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            placeholder="Type your question here..."
            className="flex-1 bg-slate-50 rounded-2xl border-2 border-slate-200 px-4 py-3 font-medium focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
          />
          <Button
            data-testid="send-button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 rounded-full font-bold shadow-[0_4px_0_0_rgba(79,70,229,1)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
