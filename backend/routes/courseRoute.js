import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { 
    createCourse, 
    createLecture, 
    editCourse, 
    editLecture, 
    getCourseById, 
    getCourseLecture, 
    getCreatorById, 
    getCreatorCourses, 
    getPublishedCourses, 
    removeCourse, 
    removeLecture 
} from "../controllers/courseController.js";
import upload from "../middlewares/multer.js";

let courseRouter = express.Router();

// COURSE ROUTES
courseRouter.post("/create", isAuth, createCourse);
courseRouter.get("/getpublishedcourses", getPublishedCourses);
courseRouter.get("/getcreatorcourses", isAuth, getCreatorCourses);
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse);
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById);
courseRouter.delete("/removecourse/:courseId", isAuth, removeCourse);

// LECTURE ROUTES
courseRouter.post("/createlecture/:courseId", isAuth, createLecture);
courseRouter.get("/getcourselecture/:courseId", isAuth, getCourseLecture);
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture);

// ✅ FIXED: EDIT LECTURE with proper file handling
courseRouter.post(
    "/editlecture/:lectureId", 
    isAuth, 
    upload.fields([
        { name: "videoUrl", maxCount: 1 }, 
        { name: "notesUrl", maxCount: 1 }
    ]), 
    editLecture
);

courseRouter.post("/getcreator", isAuth, getCreatorById);

export default courseRouter;