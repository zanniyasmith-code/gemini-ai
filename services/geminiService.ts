import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Safe access to process.env for browser environments
  let apiKey: string | undefined;
  try {
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Error accessing process.env:", e);
  }

  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled or mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProductInsight = async (productTitle: string, productDesc: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "AI Insight Unavailable: Please configure your API Key to see smart summaries.";
  }

  try {
    const prompt = `
      Analyze this product for a potential buyer.
      Product: ${productTitle}
      Description: ${productDesc}
      
      Provide a concise 3-bullet point summary of why this is worth buying (Pros) and 1 potential downside (Con).
      Keep the tone professional yet persuasive, like a top-tier tech reviewer.
      Format neatly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI insight. Please try again later.";
  }
};