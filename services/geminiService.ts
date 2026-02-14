
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    // Instantiate right before call to ensure fresh API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Gemini API requires the history to start with a 'user' message.
    // Our local history starts with a 'model' welcome message, so we skip it for the API call.
    const validHistory = history.filter((msg, index) => {
      if (index === 0 && msg.role === 'model') return false;
      return true;
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...validHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text || "I'm having a little trouble thinking right now. Can you try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a user-friendly error message that Buddy would say
    return "Oops! My brain is a bit fuzzy right now. Maybe we could try again in a second?";
  }
};
