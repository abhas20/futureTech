import mongoose from "mongoose";

const AIEmbeddingSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
  chunk: String,
  embedding: [Number],
});

export default mongoose.model("AIEmbedding", AIEmbeddingSchema);