import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askGroq = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // ✅ VALID MODEL
    messages: [
      { role: "system", content: "You are a helpful course tutor." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
};