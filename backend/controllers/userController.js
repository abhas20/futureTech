import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Get Profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");
        if (!user) return res.status(400).json({ message: "user does not found" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: "get current user error" });
    }
}

// REAL-TIME XP AWARDING (Fixed)
export const updateProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const { lectureId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Accurate ID conversion
        const lectureObjectId = new mongoose.Types.ObjectId(lectureId);

        // Check if already completed
        if (user.completedLectures.some(id => id.equals(lectureObjectId))) {
            return res.status(200).json({ success: true, user }); 
        }

        user.completedLectures.push(lectureObjectId);
        
        // --- CRITICAL FIX HERE ---
        // Prevents "NaN" if user.xp is undefined in the database
        user.xp = (user.xp || 0) + 50; 
        // -------------------------

        // Rank Logic
        let newRank = "Novice";
        if (user.xp >= 1500) newRank = "Terminator";
        else if (user.xp >= 1000) newRank = "Master";
        else if (user.xp >= 500) newRank = "Expert";
        else if (user.xp >= 200) newRank = "Apprentice";
        
        user.rank = newRank;
        
        // Save is now safe because XP is guaranteed to be a valid Number
        await user.save();

        res.status(200).json({ success: true, user }); 
    } catch (error) {
        res.status(500).json({ message: "Error updating progress" });
    }
};

// GLOBAL LEADERBOARD DATA
export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({ role: "student" })
            .sort({ xp: -1 })
            .limit(10)
            .select("name photoUrl xp rank");
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Leaderboard error" });
    }
}

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const interests = req.body.interests ? JSON.parse(req.body.interests) : [];
    const socialLinks = req.body.socialLinks
      ? JSON.parse(req.body.socialLinks)
      : {};

    const preferredFields = req.body.preferredFields
      ? JSON.parse(req.body.preferredFields)
      : [];
    


    const updateData = {
      name,
      description,
      skills,
      interests,
      socialLinks,
      preferredFields,
    };

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      updateData.photoUrl = uploadResponse.secure_url || uploadResponse.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
