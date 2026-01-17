import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join_course", ({ courseId }) => {
      socket.join(`course_${courseId}`);
    });

    socket.on("send_message", async ({ courseId, userId, userName, message }) => {
      if (!message.trim()) return;

      const chat = await CourseChat.create({
        courseId,
        sender: userId,
        message,
      });

      // 🔥 Emit to everyone EXCEPT sender (prevents duplicate message)
      socket.to(`course_${courseId}`).emit("receive_message", {
        _id: chat._id,
        courseId,
        sender: {
          _id: userId,
          name: userName,
        },
        message,
        createdAt: chat.createdAt,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected");
    });
  });
};