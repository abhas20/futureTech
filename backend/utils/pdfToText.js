import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

export const extractPdfTextFromUrl = async (pdfUrl) => {

  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });

  const data = new Uint8Array(response.data);

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let text = "";


  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  return text;
};