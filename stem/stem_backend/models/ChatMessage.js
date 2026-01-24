import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  id: String,
  session_id: String,
  role: String,
  content: String,
  timestamp: String
});

export default mongoose.model("ChatMessage", ChatMessageSchema);
