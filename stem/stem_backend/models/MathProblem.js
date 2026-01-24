import mongoose from "mongoose";

const MathProblemSchema = new mongoose.Schema({
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MathTopic",
    required: true
  },
  question: String,
  answer: String,
  difficulty: String,
  explanation: String
});

export default mongoose.model("MathProblem", MathProblemSchema);
