import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithGemini = async (history: { role: string; parts: string }[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are the AI Assistant for EarlyShield, a campus risk management platform. You help students report issues and admins manage risks. Be concise, helpful, and professional.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.parts }]
      }))
    });

    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const analyzeRiskZone = async (zoneName: string, currentRisk: string) => {
  try {
    // Gemini 2.5 Flash supports Google Maps Grounding
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the location "${zoneName}" (University Campus Context). 
      Current internal risk level: ${currentRisk}.
      Find real-world data about this place (or similar places if generic) and suggest safety protocols.
      Provide a brief 2-sentence summary of the location and 3 bullet points for safety recommendations.`,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });
    return response.text;
  } catch (error) {
    console.error("Map Analysis Error:", error);
    return "Unable to connect to Gemini Maps Intelligence. Using cached protocols.";
  }
};

export const analyzeCaseSignals = async (signals: any[]) => {
  try {
    const signalText = signals.map(s => `- [${s.timestamp}] ${s.title}: ${s.description}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these risk signals received from campus:
      ${signalText}
      
      1. Summarize the root cause.
      2. Determine if this is an isolated incident or a cluster.
      3. Recommend an immediate action for the admin.
      
      Format as HTML string (no markdown blocks) with bold tags for emphasis.`,
    });
    return response.text;
  } catch (error) {
    console.error("Case Analysis Error:", error);
    return "AI Analysis unavailable.";
  }
};