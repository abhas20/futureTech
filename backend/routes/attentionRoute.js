import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { pushSignal, getAttention } from "../utils/attentionBuffer.js";
import isAuth from "../middlewares/isAuth.js";
import dotenv from "dotenv"
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post(
  "/frame",
  isAuth,
  upload.single("frame"),
  async (req, res) => {
    try {
      console.log("HIT ATTENTION ROUTE");

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No frame received" });
      }

      const userId = req.userId;
      const { lectureId } = req.body;

      if (!lectureId) {
        return res.status(400).json({ error: "lectureId is required" });
      }

      console.log("User:", userId);
      console.log("Lecture:", lectureId);
      console.log("Frame size:", req.file.buffer.length);

      const form = new FormData();
      form.append("frame", req.file.buffer, {
        filename: "frame.jpg",
        contentType: "image/jpeg",
      });

      const { data } = await axios.post(
  `${process.env.ATTENTION_URL}/analyze`,
  form,
  {
    headers: form.getHeaders(),
    timeout: 5000
  }
);


      // 🔥 PER-VIDEO KEY (IMPORTANT)
      const key = `${userId}:${lectureId}`;

      pushSignal(key, data);
      const attention = getAttention(key);

      return res.json({
        raw: data,
        temporal: attention,
      });
    } catch (err) {
      console.error("🔥 ATTENTION ROUTE ERROR:", err);
      return res.status(500).json({ error: "Attention processing failed" });
    }
  }
);

export default router;