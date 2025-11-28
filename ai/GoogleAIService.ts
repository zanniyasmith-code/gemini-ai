import { GoogleGenAI } from "@google/genai";

// Declare process for TypeScript to avoid compilation errors
declare var process: {
  env: {
    API_KEY?: string;
    [key: string]: any;
  }
};

const SYSTEM_INSTRUCTION = `You are a Business and Investment Advisor for the OmniCalc app.
Your goal is to help users with:
- Business profitability planning (margins, pricing, break-even)
- Investment guidance (SIP, compounding, risk)

Rules:
- Be concise and helpful.
- Use simple language.
- Ask clarifying questions if needed.
- Disclaimer: Remind users that this is for educational purposes only and not professional financial advice.
`;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Lazy initialization holder
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    // Access process.env.API_KEY safely.
    // The declaration above satisfies TypeScript.
    // The polyfill in index.html ensures 'process' exists at runtime.
    // The bundler should replace 'process.env.API_KEY' with the actual key string.
    const apiKey = process?.env?.API_KEY;
    
    if (!apiKey) {
      console.warn("Google API Key is missing. Chatbot may not function.");
    }

    ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
  }
  return ai;
};

export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const client = getAiClient();

    // Map existing history to the format expected by the SDK
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Create a chat session with the full history
    const chat = client.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: chatHistory
    });

    // Send the new message
    const result = await chat.sendMessage({ message: newMessage });
    
    // Return the text response
    return result.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to AI Advisor. Please check your connection or try again later.");
  }
};