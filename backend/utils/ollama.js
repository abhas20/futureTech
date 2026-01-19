import axios from "axios";

export async function askOllama(context, question) {
  const res = await axios.post("http://localhost:11434/api/generate", {
    model: "phi3:mini",
    prompt: `
You are a course tutor.
Use the context below to answer clearly.

Context:
${context}

Question:
${question}
`,
    stream: false,
  });

  return res.data.response;
}