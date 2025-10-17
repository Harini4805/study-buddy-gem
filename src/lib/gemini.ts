const GEMINI_API_KEY = "AIzaSyBHXcq-QF5TAvNpKnQfippKayebOjWjbOI";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

async function makeRequest(messages: Message[], retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
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
        const errorData = await response.json().catch(() => ({}));
        
        // Retry on 503 (service unavailable) or 429 (rate limit)
        if ((response.status === 503 || response.status === 429) && i < retries - 1) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error("Failed after retries");
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    return await makeRequest(messages);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
