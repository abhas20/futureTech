import { StreamClient } from "@stream-io/node-sdk";
import { LiveLecture } from "../models/liveLectureModel.js";
import Course from "../models/courseModel.js"; 
import { v2 as cloudinary } from 'cloudinary'; 
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import axios from "axios";
dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Initialize Stream client only if credentials exist
let streamClient = null;
if (process.env.STREAM_API_KEY && process.env.STREAM_SECRET_KEY) {
  streamClient = new StreamClient(
    process.env.STREAM_API_KEY, 
    process.env.STREAM_SECRET_KEY
  );
} else {
  console.warn("[Live] Stream credentials not configured. Using fallback mode.");
}

// Helper function to check if user is instructor
const isInstructor = (lecture, userId) => {
  return lecture.instructorId.toString() === userId.toString();
};

export const createLiveLecture = async (req, res) => {
  try {
    const { courseId, topic, description, startTime, duration } = req.body;
    const instructorId = req.userId;
    const meetingId = `live-${courseId}-${Date.now()}`;

    console.log(`[Create Lecture] Creating lecture: ${meetingId}`);

    const newLecture = await LiveLecture.create({
      courseId,
      instructorId,
      topic,
      description,
      startTime,
      duration,
      meetingId,
      isActive: true,
      status: 'upcoming'
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { liveSchedule: newLecture._id }
    });

    console.log(`[Create Lecture] Lecture created: ${newLecture._id}`);
    
    res.status(201).json({ 
      success: true, 
      lecture: newLecture,
      message: "Live lecture created successfully."
    });
  } catch (error) {
    console.error(`[Create Lecture Error]:`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lectures = await LiveLecture.find({ courseId })
      .populate('instructorId', 'name photoUrl')
      .sort({ startTime: -1 });
    res.status(200).json({ success: true, lectures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.userId.toString();
    
    // Check if Stream is configured
    if (!streamClient) {
      return res.status(200).json({ 
        success: true, 
        token: "no-stream-token",
        apiKey: "no-stream-key",
        userId,
        mode: "fallback",
        message: "Stream not configured. Using fallback mode."
      });
    }
    
    const token = streamClient.generateUserToken({ 
      user_id: userId, 
      validity_in_seconds: 86400 
    });
    
    console.log(`[Get Token] Generated token for user: ${userId}`);
    
    res.status(200).json({ 
      success: true, 
      token, 
      apiKey: process.env.STREAM_API_KEY,
      userId,
      mode: "stream"
    });
  } catch (error) {
    console.error(`[Get Token Error]:`, error);
    
    // Return fallback token even if Stream fails
    res.status(200).json({ 
      success: true, 
      token: "fallback-token-" + Date.now(),
      apiKey: "fallback-key",
      userId: req.userId.toString(),
      mode: "fallback",
      message: "Using fallback mode due to Stream error."
    });
  }
};

export const endLiveLecture = async (req, res) => {
  try {
    const { meetingId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ 
        success: false, 
        message: "Meeting ID is required" 
      });
    }
    
    console.log(`[End Lecture] Request received. Meeting ID: ${meetingId}, User ID: ${req.userId}`);
    
    const lecture = await LiveLecture.findOne({ meetingId });
    
    if (!lecture) {
      console.log(`[End Lecture] Lecture not found: ${meetingId}`);
      return res.status(404).json({ 
        success: false, 
        message: "Lecture not found" 
      });
    }
    
    console.log(`[End Lecture] Found lecture. Instructor ID: ${lecture.instructorId}, Request User ID: ${req.userId}`);
    
    // Check if user is the instructor
    const isInstructorUser = lecture.instructorId.toString() === req.userId.toString();
    
    if (!isInstructorUser) {
      console.log(`[End Lecture] Unauthorized: User ${req.userId} is not instructor ${lecture.instructorId}`);
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only instructor can end the lecture" 
      });
    }
    
    // Check if lecture is already ended
    if (!lecture.isActive) {
      console.log(`[End Lecture] Lecture already ended: ${meetingId}`);
      return res.status(400).json({ 
        success: false, 
        message: "Lecture has already ended" 
      });
    }
    
    const updatedLecture = await LiveLecture.findOneAndUpdate(
      { meetingId },
      { 
        isActive: false, 
        endedAt: new Date(),
        status: 'completed'
      },
      { new: true }
    );
    
    console.log(`[End Lecture] Successfully ended lecture: ${meetingId}`);
    
    res.status(200).json({ 
      success: true, 
      message: "Class ended successfully.",
      lecture: updatedLecture
    });
  } catch (error) {
    console.error(`[End Lecture Error]:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error ending class" 
    });
  }
};

// === UPLOAD RECORDING FUNCTION ===
export const uploadRecording = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const userId = req.userId;
    
    const lecture = await LiveLecture.findOne({ meetingId });

    if (!lecture) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: "Lecture not found" 
      });
    }

    // Check if user is the instructor
    if (!isInstructor(lecture, userId)) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only instructor can upload recording" 
      });
    }

    // Check if video file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No video file provided" 
      });
    }

    console.log(`[Upload Recording] Processing for: ${meetingId}`);

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        public_id: `lecture_${lecture._id}_${Date.now()}`,
        folder: "lms_recordings",
        timeout: 180000
      });

      // Update lecture with recording URL
      lecture.recordingUrl = uploadResult.secure_url;
      lecture.recordingUploadedAt = new Date();
      await lecture.save();

      console.log(`[Upload Recording] Success! URL: ${lecture.recordingUrl}`);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        message: "Recording uploaded successfully!",
        url: lecture.recordingUrl
      });

    } catch (uploadError) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      throw uploadError;
    }

  } catch (error) {
    console.error(`[Upload Recording Error]:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// === UPDATE RECORDING FUNCTION ===
export const updateRecording = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const userId = req.userId;
    
    const lecture = await LiveLecture.findOne({ meetingId });

    if (!lecture) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: "Lecture not found" 
      });
    }

    // Check if user is the instructor
    if (!isInstructor(lecture, userId)) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only instructor can update recording" 
      });
    }

    // Check if video file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No video file provided" 
      });
    }

    console.log(`[Update Recording] Processing for: ${meetingId}`);

    try {
      // Upload new recording to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        public_id: `lecture_${lecture._id}_${Date.now()}_updated`,
        folder: "lms_recordings",
        timeout: 180000
      });

      // Update lecture with new recording URL
      const oldRecordingUrl = lecture.recordingUrl;
      lecture.recordingUrl = uploadResult.secure_url;
      lecture.recordingUpdatedAt = new Date();
      await lecture.save();

      console.log(`[Update Recording] Success! New URL: ${lecture.recordingUrl}`);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      // Delete old recording from Cloudinary if needed
      if (oldRecordingUrl) {
        try {
          const publicId = oldRecordingUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`lms_recordings/${publicId}`, { 
            resource_type: 'video' 
          });
        } catch (deleteError) {
          console.warn(`[Update Recording] Could not delete old recording:`, deleteError);
        }
      }

      res.status(200).json({
        success: true,
        message: "Recording updated successfully!",
        url: lecture.recordingUrl,
        oldUrl: oldRecordingUrl
      });

    } catch (uploadError) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      throw uploadError;
    }

  } catch (error) {
    console.error(`[Update Recording Error]:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// === UPLOAD NOTES FUNCTION ===
export const uploadNotes = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const userId = req.userId;
    
    const lecture = await LiveLecture.findOne({ meetingId });

    if (!lecture) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false, 
        message: "Lecture not found" 
      });
    }

    // Check if user is the instructor
    if (!isInstructor(lecture, userId)) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only instructor can upload notes" 
      });
    }

    // Check if notes file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file provided" 
      });
    }

    // Validate file type - Only allow PDF
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    if (fileExt !== '.pdf') {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        success: false, 
        message: "Only PDF files are allowed for notes" 
      });
    }

    console.log(`[Upload Notes] Processing PDF for: ${meetingId}`);

    try {
      // Upload PDF to Cloudinary with raw resource type
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw', // Use 'raw' for PDF files
        public_id: `notes_${lecture._id}_${Date.now()}`,
        folder: "lms_notes",
        timeout: 60000,
        type: 'upload'
      });

      // Update lecture with notes information
      lecture.notes = {
        url: uploadResult.secure_url,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        uploadedAt: new Date(),
        publicId: uploadResult.public_id
      };
      await lecture.save();

      console.log(`[Upload Notes] Success! URL: ${lecture.notes.url}`);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        message: "Notes uploaded successfully!",
        notes: lecture.notes
      });

    } catch (uploadError) {
      // Clean up uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      throw uploadError;
    }

  } catch (error) {
    console.error(`[Upload Notes Error]:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// === DOWNLOAD NOTES FUNCTION ===
// === DOWNLOAD NOTES FUNCTION ===
export const downloadNotes = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const lecture = await LiveLecture.findOne({ meetingId });

    if (!lecture || !lecture.notes || !lecture.notes.url) {
      return res.status(404).json({
        success: false,
        message: "Notes not found",
      });
    }

    console.log(`[Download Notes] Processing for: ${meetingId}`);

    const fileUrl = lecture.notes.url;
    const fileName = lecture.notes.name || "Lecture_Notes";
    
    // Ensure the filename has .pdf extension
    let finalFileName = fileName;
    if (!finalFileName.toLowerCase().endsWith('.pdf')) {
      finalFileName = `${finalFileName}.pdf`;
    }
    
    // Sanitize filename
    finalFileName = finalFileName.replace(/[^a-zA-Z0-9-_. ]/g, "").trim();

    // If it's a Cloudinary URL
    if (fileUrl.includes('cloudinary.com')) {
      try {
        // Get the file from Cloudinary as a buffer
        const response = await axios({
          method: "GET",
          url: fileUrl,
          responseType: "arraybuffer", // Use arraybuffer for binary data
        });

        // Set proper headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${finalFileName}"`);
        res.setHeader('Content-Length', response.data.length);
        
        // Send the PDF file
        res.send(response.data);

      } catch (error) {
        console.error(`[Download Notes Cloudinary Error]:`, error.message);
        // Fallback: redirect to Cloudinary URL with attachment flag
        let downloadUrl = fileUrl;
        if (!fileUrl.includes('/fl_attachment')) {
          const parts = fileUrl.split('/upload/');
          if (parts.length === 2) {
            downloadUrl = `${parts[0]}/upload/fl_attachment:${finalFileName}/${parts[1]}`;
          }
        }
        return res.redirect(downloadUrl);
      }
    } else {
      // For non-Cloudinary URLs
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
      });

      // Set headers for PDF download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${finalFileName}"`
      );
      res.setHeader("Content-Type", "application/pdf");

      response.data.pipe(res);
    }
  } catch (error) {
    console.error(`[Download Notes Error]:`, error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to download notes",
      });
    }
  }
};
// === DELETE NOTES FUNCTION ===
export const deleteNotes = async (req, res) => {
  try {
    const { meetingId } = req.body;
    const userId = req.userId;
    
    const lecture = await LiveLecture.findOne({ meetingId });

    if (!lecture) {
      return res.status(404).json({ 
        success: false, 
        message: "Lecture not found" 
      });
    }

    // Check if user is the instructor
    if (!isInstructor(lecture, userId)) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only instructor can delete notes" 
      });
    }

    if (!lecture.notes) {
      return res.status(200).json({ 
        success: true, 
        message: "No notes to delete" 
      });
    }

    console.log(`[Delete Notes] Deleting notes for: ${meetingId}`);

    // Delete file from Cloudinary
    try {
      const publicId = lecture.notes.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`lms_notes/${publicId}`, { resource_type: 'raw' });
    } catch (deleteError) {
      console.warn(`[Delete Notes] Could not delete from Cloudinary:`, deleteError);
    }

    // Clear notes from lecture
    lecture.notes = null;
    await lecture.save();

    res.status(200).json({
      success: true,
      message: "Notes deleted successfully!"
    });

  } catch (error) {
    console.error(`[Delete Notes Error]:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// === GET ALL LECTURES (with instructor check) ===
export const getAllLectures = async (req, res) => {
  try {
    const userId = req.userId;
    
    const lectures = await LiveLecture.find()
      .populate('courseId', 'title thumbnail')
      .populate('instructorId', 'name photoUrl')
      .sort({ startTime: -1 })
      .lean();

    // Add isInstructor flag for each lecture
    const lecturesWithInstructorFlag = lectures.map(lecture => ({
      ...lecture,
      isInstructor: lecture.instructorId && lecture.instructorId._id.toString() === userId.toString()
    }));

    res.status(200).json({ 
      success: true, 
      lectures: lecturesWithInstructorFlag 
    });
  } catch (error) {
    console.error("[Get All Lectures Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// === GET MY LECTURES (only instructor's lectures) ===
export const getMyLectures = async (req, res) => {
  try {
    const userId = req.userId;
    
    const lectures = await LiveLecture.find({ instructorId: userId })
      .populate('courseId', 'title thumbnail')
      .sort({ startTime: -1 });

    res.status(200).json({ 
      success: true, 
      lectures 
    });
  } catch (error) {
    console.error("[Get My Lectures Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};