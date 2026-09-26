import { createWorker } from "tesseract.js";

export type RecognitionLanguage =
  | "fra"
  | "eng"
  | "jpn"
  | "kor";

export type CardRecognitionResult = {
  text: string;
  confidence: number;
  language: RecognitionLanguage;
};

export async function recognizeCardText(
  image: string | Blob,
  language: RecognitionLanguage = "eng"
): Promise<CardRecognitionResult> {
  const worker = await createWorker(
    language,
    1
  );

  try {
    const result =
      await worker.recognize(image);

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      language,
    };
  } finally {
    await worker.terminate();
  }
}