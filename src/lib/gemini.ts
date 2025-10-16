const GEMINI_API_KEY = "AIzaSyBHXcq-QF5TAvNpKnQfippKayebOjWjbOI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        systemInstruction: {
          parts: [{
            text: `You are an expert course recommendation assistant. Your primary goal is to help users find the perfect courses for their learning needs.

Guidelines:
- Ask clarifying questions about their goals, experience level, and interests
- Provide personalized course recommendations based on their responses
- Explain why each course would be beneficial for them
- Be enthusiastic and encouraging about learning
- Keep responses concise but informative
- Focus on actionable advice and clear next steps`
          }]
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
