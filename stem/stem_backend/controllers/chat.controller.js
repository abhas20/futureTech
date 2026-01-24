import ChatMessage from "../models/ChatMessage.js";
import { v4 as uuid } from "uuid";

export const chatWithTutor = async (req, res) => {
  const { session_id, message } = req.body;

  await ChatMessage.create({
    id: uuid(),
    session_id,
    role: "user",
    content: message,
    timestamp: new Date().toISOString()
  });

  // Placeholder AI response (plug OpenAI/Claude later)
  const aiResponse =
    "Hey! 😊 I'm your STEM buddy. Let's learn something cool today!";

  await ChatMessage.create({
    id: uuid(),
    session_id,
    role: "assistant",
    content: aiResponse,
    timestamp: new Date().toISOString()
  });

  res.json({ response: aiResponse });
};

export const getChatHistory = async (req, res) => {
  res.json(
    await ChatMessage.find(
      { session_id: req.params.session_id },
      { _id: 0 }
    ).sort({ timestamp: 1 })
  );
};
