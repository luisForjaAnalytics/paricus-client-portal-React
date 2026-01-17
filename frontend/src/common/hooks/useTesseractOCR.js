import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import Tesseract from "tesseract.js";

// Configurar PDF.js worker
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const useTesseractOCR =()=> {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractImagesFromPDF = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const images = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Render page to canvas
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert to PNG dataURL
        const imgData = canvas.toDataURL("image/png");
        images.push(imgData);
      }

      return images;
    } catch (err) {
      console.error(`ERROR extractImagesFromPDF: ${err}`);
      throw err;
    }
  }, []);

  const runOcr = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      setText("");
      setProgress(0);

      // 1. Convert PDF to images
      const images = await extractImagesFromPDF(file);

      let finalText = "";
      const totalPages = images.length;

      // 2. OCR each page
      for (let i = 0; i < totalPages; i++) {
        const img = images[i];

        const result = await Tesseract.recognize(img, "spa+eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              const pageProgress = (i / totalPages) * 100 + m.progress * (100 / totalPages);
              setProgress(Math.min(100, pageProgress * 100));
            }
          },
        });

        finalText += `\n\n=== Página ${i + 1} ===\n\n`;
        finalText += result.data.text;
      }

      setText(finalText);
      setProgress(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [extractImagesFromPDF]);

  const reset = useCallback(() => {
    setText("");
    setProgress(0);
    setLoading(false);
    setError(null);
  }, []);

  return {
    text,
    progress,
    loading,
    error,
    runOcr,
    reset,
  };
}
