import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import mongoose from "mongoose";
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

    // ================= SEND MESSAGE =================
    socket.on("send_message", async ({ courseId, userId, userName, message }) => {
      if (!message?.trim()) return;

      const chat = await CourseChat.create({
        courseId,
        sender: userId,
        message,
        upvotes: 0,
        voters: [],
      });

      const populated = await chat.populate("sender", "name");

      io.to(`course_${courseId}`).emit("receive_message", {
        _id: populated._id,
        courseId,
        sender: populated.sender,
        message: populated.message,
        upvotes: populated.upvotes,
        voters: populated.voters,
        createdAt: populated.createdAt,
      });
    });

    // ================= 👍 UPVOTE TOGGLE =================
    socket.on("upvote_message", async ({ messageId, courseId, userId }) => {
      //const chat = await CourseChat.findById(messageId);
      
      if (!mongoose.Types.ObjectId.isValid(messageId)) return;

      const chat = await CourseChat.findById(messageId);
      if (!chat) return;

      const hasUpvoted = chat.voters.some(
        (id) => id.toString() === userId
      );

      if (hasUpvoted) {
        chat.voters = chat.voters.filter(
          (id) => id.toString() !== userId
        );
        chat.upvotes = Math.max(0, chat.upvotes - 1);
      } else {
        chat.voters.push(userId);
        chat.upvotes += 1;
      }

      await chat.save();

      io.to(`course_${courseId}`).emit("message_upvoted", {
        messageId,
        upvotes: chat.upvotes,
        voters: chat.voters,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};