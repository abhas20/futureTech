import express from "express";
import multer from "multer";
import { 
  createLiveLecture, 
  getLectures, 
  getStreamToken, 
  endLiveLecture, 
  getAllLectures,
  getMyLectures,
  uploadRecording,
  updateRecording,
  uploadNotes,
  deleteNotes,
  downloadNotes
} from "../controllers/liveController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size for videos
  }
});

const uploadNotesMulter = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size for notes
  }
});

// Apply authentication middleware to all routes
router.use(isAuth);

// Lecture management routes
router.post("/create", createLiveLecture);
router.get("/course/:courseId", getLectures);
router.get("/get-token", getStreamToken);
router.get("/all", getAllLectures);
router.get("/my-lectures", getMyLectures);
router.post("/end", endLiveLecture);

// Recording routes
router.post("/upload-recording", upload.single('video'), uploadRecording);
router.post("/update-recording", upload.single('video'), updateRecording);

// Notes routes
router.post("/upload-notes", uploadNotesMulter.single('notes'), uploadNotes);
router.post("/delete-notes", deleteNotes);
router.get("/download-notes/:meetingId", downloadNotes);

export default router;