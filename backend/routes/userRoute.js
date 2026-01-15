import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { 
    getCurrentUser, 
    UpdateProfile, 
    updateProgress, 
    getLeaderboard 
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.post("/updateprofile", isAuth, upload.single("photoUrl"), UpdateProfile);

// Gamification routes
userRouter.post("/progress", isAuth, updateProgress);
userRouter.get("/leaderboard", getLeaderboard);

export default userRouter;