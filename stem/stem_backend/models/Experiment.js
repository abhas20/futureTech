import mongoose from "mongoose";

const ExperimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      enum: ["chemistry", "physics"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materials: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
    safety_notes: {
      type: [String],
      default: [],
    },
    learning_objectives: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Experiment", ExperimentSchema);
