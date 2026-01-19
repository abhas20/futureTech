
export function embedText(text) {
  const vector = new Array(384).fill(0);
  for (let i = 0; i < text.length; i++) {
    vector[i % 384] += text.charCodeAt(i) / 255;
  }
  return vector;
}