import Lecture from "../models/lectureModel.js";
import AIEmbedding from "../models/AIEmbedding.js";
import { extractPdfTextFromUrl } from "../utils/pdfToText.js";

export const indexLectureNotes = async (lectureId, courseId) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture?.notesUrl) return;

  const text = await extractPdfTextFromUrl(lecture.notesUrl);

  const chunks = text
    .replace(/\s+/g, " ")
    .match(/.{1,800}/g); 
  await AIEmbedding.deleteMany({ lectureId });

  for (const chunk of chunks) {
    await AIEmbedding.create({
      courseId,
      lectureId,
      chunk,
    });
  }

  console.log("✅ Gemini-ready notes indexed:", lecture.lectureTitle);
};