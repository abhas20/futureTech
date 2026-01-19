import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434";

export async function isOllamaRunning() {
  try {
    await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 1500 });
    return true;
  } catch {
    return false;
  }
}

export async function askOllama(prompt) {
  const res = await axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model: "mistral",
      prompt,
      stream: false,
    },
    { timeout: 60_000 }
  );

  return res.data.response;
}