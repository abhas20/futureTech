import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { serverUrl } from "../App";

function CourseChat({ courseId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // ✅ create socket AFTER serverUrl exists
    socketRef.current = io(serverUrl, {
      withCredentials: true,
    });

    socketRef.current.emit("join_course", { courseId });

    axios
      .get(`${serverUrl}/api/chat/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data));

    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const optimisticMsg = {
      _id: Date.now(), // temporary id
      message: text,
      sender: {
        _id: user._id,
        name: user.name,
      },
    };

    // Optimistically render message with username
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
    <div className="border rounded-xl p-4 h-[400px] flex flex-col">
      <h3 className="font-bold mb-2">💬 Community Chat</h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m._id} className="text-sm">
            <b>{m.sender?.name || "User"}:</b> {m.message}
          </div>
        ))}

        {/* 👇 Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2"
          placeholder="Ask a doubt..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CourseChat;