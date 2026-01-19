import { StreamClient } from "@stream-io/node-sdk";
import { LiveLecture } from "../models/liveLectureModel.js";
import Course from "../models/courseModel.js"; 
import dotenv from "dotenv";
dotenv.config();


const streamClient = new StreamClient(process.env.STREAM_API_KEY, process.env.STREAM_SECRET_KEY);

export const createLiveLecture = async (req, res) => {
  try {
    const { courseId, topic, description, startTime, duration } = req.body;
    const instructorId = req.user._id; 


    const meetingId = `live-${courseId}-${Date.now()}`;


    const newLecture = await LiveLecture.create({
      courseId,
      instructorId,
      topic,
      description,
      startTime,
      duration,
      meetingId
    });

   
    await Course.findByIdAndUpdate(courseId, {
      $push: { liveSchedule: newLecture._id }
    });

    res.status(201).json({ success: true, lecture: newLecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lectures = await LiveLecture.find({ courseId }).sort({ startTime: 1 });
    res.status(200).json({ success: true, lectures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
  
    const token = streamClient.generateUserToken({ user_id: userId });
    res.status(200).json({ success: true, token, apiKey: process.env.STREAM_API_KEY });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};