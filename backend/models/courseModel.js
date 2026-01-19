import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    liveSchedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LiveLecture"
    }],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    enrolledCount: {
        type: Number,
        default: 0
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;