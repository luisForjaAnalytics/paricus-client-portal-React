import { useState, useCallback } from "react";
import Tesseract from "tesseract.js";

export const  useTesseractOCR =()=> {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const recognize = useCallback(async (imageFile, lang = "spa") => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setText("");

      const result = await Tesseract.recognize(imageFile, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setText(result.data.text);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    text,
    progress,
    isLoading,
    error,
    recognize,
  };
}
