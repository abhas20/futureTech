import mongoose from "mongoose";

const aiEmbeddingSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
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
    embedding: {
      type: [Number],
      required: true,
    },
    source: {
      type: String,
      enum: ["notes", "summary"],
      required: false,
    },
  },
  { timestamps: true }
);

const AIEmbedding = mongoose.model("AIEmbedding", aiEmbeddingSchema);
export default AIEmbedding;