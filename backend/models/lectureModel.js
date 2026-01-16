import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: null
    },
    audioUrl: {
        type: String,
        default: null
    },
    notesUrl: {
        type: String,
        default: null
    },
    isPreviewFree: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;