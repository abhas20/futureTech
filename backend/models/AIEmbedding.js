import mongoose from "mongoose";

const aiEmbeddingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  chunk: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("AIEmbedding", aiEmbeddingSchema);