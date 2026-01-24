import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  id: String,
  user_id: String,
  subject: String,
  topic_id: String,
  completed: Boolean,
  score: Number,
  timestamp: String
});

export default mongoose.model("Progress", ProgressSchema);
