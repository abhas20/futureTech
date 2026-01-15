import mongoose from "mongoose"

const mediaSchema = new mongoose.Schema({
  videoPath: String,
  audioPath: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Media", mediaSchema);