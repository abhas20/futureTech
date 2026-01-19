import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { serverUrl } from "../App";
import { FaPaperPlane } from "react-icons/fa";

function CourseChat({ courseId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(serverUrl, { withCredentials: true });
    socketRef.current.emit("join_course", { courseId });

    axios
      .get(`${serverUrl}/api/chat/${courseId}`, { withCredentials: true })
      .then((res) => setMessages(res.data));

    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on("message_upvoted", ({ messageId, upvotes, voters }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, upvotes, voters } : m
        )
      );
    });

    return () => socketRef.current.disconnect();
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      message: text,
      upvotes: 0,
      voters: [],
      optimistic: true,
      sender: { _id: user._id, name: user.name },
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    socketRef.current.emit("send_message", {
      courseId,
      userId: user._id,
      userName: user.name,
      message: text,
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-[420px] bg-white rounded-3xl shadow-xl border overflow-hidden">
      {/* HEADER */}
      <div className="px-5 py-3 border-b bg-gradient-to-r from-black to-blue-600 text-white">
        <h3 className="font-semibold text-sm">💬 Course Community Chat</h3>
        <p className="text-xs opacity-80">Ask doubts & help others</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((m) => {
          const isMe = m.sender?._id === user._id;

          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-2">
                  {m.sender?.name?.[0] || "U"}
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow pointer-events-auto
                  ${
                    isMe
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }`}>
                {!isMe && (
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {m.sender?.name || "User"}
                </p>
              )}

              <p>{m.message}</p>

              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <button
                  type="button"
                  disabled={m.optimistic}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (m.optimistic) return;
                    socketRef.current.emit("upvote_message", {
                      messageId: m._id,
                      courseId,
                      userId: user._id,
                    });
                  }}
                  className={`cursor-pointer pointer-events-auto transition ${
                    m.optimistic
                      ? "opacity-40 cursor-not-allowed"
                      : m.voters?.includes(user._id)
                      ? "text-blue-600"
                      : "hover:text-blue-600"
                  }`}
                >
                  👍
                </button>
                <span>{m.upvotes || 0}</span>
              </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-black hover:bg-blue-600 transition text-white px-4 rounded-full flex items-center justify-center">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default CourseChat;
