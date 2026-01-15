import express from "express"
import multer from "multer"
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import path from "path"
import Media from "../models/Media.js"

ffmpeg.setFfmpegPath(ffmpegPath)

const router = express.Router()

const storage = multer.diskStorage({
  destination: "uploads/videos",
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage })

router.post("/upload", upload.single("video"), async (req, res) => {
  const videoPath = req.file.path
  const audioPath = `uploads/audios/${Date.now()}.mp3`

  ffmpeg(videoPath)
    .outputOptions("-vn")
    .audioCodec("libmp3lame")
    .format("mp3")
    .on("end", async () => {
      const media = await Media.create({ videoPath, audioPath })
      res.json(media)
    })
    .on("error", (err) => {
      console.log("FFMPEG ERROR:", err.message)
      res.status(500).json({ error: err.message })
    })
    .save(audioPath)
})

export default router