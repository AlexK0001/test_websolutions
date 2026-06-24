import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIEmailService, GenerateEmailInput, GenerateEmailOutput } from "./types";

const lengthMap = {
  short: "2-3 short paragraphs (around 100 words)",
  medium: "3-4 paragraphs (around 200 words)",
  long: "5-6 paragraphs (around 350 words)",
};

const toneMap = {
  professional: "professional and business-appropriate",
  friendly: "warm, friendly and approachable",
  formal: "highly formal and structured",
  casual: "casual and conversational",
  persuasive: "persuasive and compelling",
};

function generateMock(input: GenerateEmailInput): GenerateEmailOutput {
  const subjects: Record<string, string> = {
    professional: `Re: ${input.topic}`,
    friendly: `Hey! About ${input.topic}`,
    formal: `Formal Correspondence: ${input.topic}`,
    casual: `Quick note on ${input.topic}`,
    persuasive: `You won't want to miss this: ${input.topic}`,
  };

  const bodies: Record<string, string> = {
    professional: `Dear Recipient,\n\nI hope this message finds you well. I am writing to you regarding ${input.topic}.\n\nAfter careful consideration, I believe this matter warrants your prompt attention. Please review the details and let me know your thoughts at your earliest convenience.\n\nI look forward to your response and am happy to discuss further should you require any clarification.\n\nBest regards,\n[Your Name]`,
    friendly: `Hi there!\n\nHope you're doing great! I just wanted to reach out about ${input.topic}.\n\nI think this could be really exciting for both of us. Would love to chat more about it when you have a moment!\n\nLet me know what you think — always happy to connect!\n\nCheers,\n[Your Name]`,
    formal: `Dear Sir/Madam,\n\nI am writing to formally address the matter of ${input.topic}.\n\nThis correspondence serves to notify you of the pertinent details surrounding this issue. I respectfully request your acknowledgement of receipt and a timely response in accordance with standard professional protocols.\n\nYours faithfully,\n[Your Name]`,
    casual: `Hey!\n\nJust dropping a quick note about ${input.topic}.\n\nNothing too serious — just wanted to keep you in the loop. Hit me back when you get a chance!\n\nTalk soon,\n[Your Name]`,
    persuasive: `Dear Recipient,\n\nI wanted to personally reach out about ${input.topic} because I genuinely believe this is an opportunity you cannot afford to miss.\n\nHere's why this matters: the benefits are clear, the timing is perfect, and the results speak for themselves. Taking action now puts you ahead of the curve.\n\nI'd love to connect and show you exactly how this works. Are you available for a quick call this week?\n\nLooking forward to hearing from you,\n[Your Name]`,
  };

  return {
    subject: subjects[input.tone] || `Email about: ${input.topic}`,
    body: bodies[input.tone] || `Dear Recipient,\n\nRegarding ${input.topic}.\n\nBest regards,\n[Your Name]`,
    generatedAt: new Date().toISOString(),
  };
}

export class GeminiEmailService implements AIEmailService {
  private model;
  private apiKey: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    this.apiKey = apiKey;
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  }

  async generate(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
    const prompt = `You are a professional email writer. Write a complete email based on these parameters:

Topic: ${input.topic}
Tone: ${toneMap[input.tone]}
Length: ${lengthMap[input.length]}

Respond ONLY with valid JSON in this exact format, no markdown, no backticks:
{
  "subject": "email subject line here",
  "body": "full email body here with \\n for line breaks"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        subject: parsed.subject,
        body: parsed.body,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn("[GeminiService] AI unavailable, using mock fallback:", error instanceof Error ? error.message : error);
      return generateMock(input);
    }
  }
}