import { GoogleGenerativeAI } from "@google/generative-ai";
import AIEmbedding from "../models/AIEmbedding.js";

// Corrected: The constructor usually only takes the API key string
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askCourseAI = async (req, res) => {
  try {
    const { question, courseId } = req.body;

    // 1️⃣ Fetch indexed lecture chunks
    const chunks = await AIEmbedding.find({ courseId }).limit(30);
    
    // Safety check: if no notes are found
    if (!chunks || chunks.length === 0) {
        return res.json({ answer: "This course has no notes indexed yet." });
    }

    const context = chunks.map(c => c.chunk).join("\n");

    // 2️⃣ Initialize model (Updated to latest stable version)
    // Adding the apiVersion here inside the model options if supported by your SDK version
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", // Use 2.0 or 2.5-flash-lite
    });

    const prompt = `
You are an AI tutor for this course.
Answer ONLY using the provided notes.
If not found, say: "This topic is not covered yet."

COURSE NOTES:
${context}

QUESTION:
${question}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      answer: text,
    });

  } catch (error) {
    console.error("Gemini error:", error);
    // Log more specific error info if available
    res.status(500).json({ 
        message: "AI failed", 
        error: error.message 
    });
  }
};