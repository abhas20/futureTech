import { isOllamaRunning, askOllama } from "../utils/ollamaClient.js";
import AICourseChat from "../models/AICourseChat.js";
import AIEmbedding from "../models/AIEmbedding.js";

export const askCourseAI = async (req, res) => {
  try {
    const { question, courseId } = req.body;
    const userId = req.userId;

    // 1️⃣ Check Ollama ONLY when user asks
    const ollamaOk = await isOllamaRunning();

    if (!ollamaOk) {
      return res.json({
        answer:
          "🤖 AI is currently unavailable on this server. Please try again later.",
      });
    }

    // 2️⃣ Fetch relevant chunks (your existing logic)
    const chunks = await AIEmbedding.find({ courseId }).limit(5);

    if (!chunks.length) {
      return res.json({
        answer: "This course has no notes indexed yet.",
      });
    }

    const context = chunks.map(c => c.chunk).join("\n\n");

    const prompt = `
You are a course tutor.
Use ONLY the context below to answer.

Context:
${context}

Question:
${question}
`;

    // 3️⃣ Ask Ollama
    const answer = await askOllama(prompt);

    // 4️⃣ Save chat (per-user memory)
    await AICourseChat.findOneAndUpdate(
      { courseId, userId },
      {
        $push: {
          messages: [
            { role: "user", content: question },
            { role: "assistant", content: answer },
          ],
        },
      },
      { upsert: true }
    );

    res.json({ answer });

  } catch (err) {
    console.error("AI Chat Error:", err.message);

    res.json({
      answer:
        "⚠️ AI encountered an issue. Please try again later.",
    });
  }
};