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

export class GeminiEmailService implements AIEmailService {
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await this.model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        subject: parsed.subject,
        body: parsed.body,
        generatedAt: new Date().toISOString(),
      };
    } catch {
      // Fallback якщо JSON не розпарсився
      return {
        subject: `Email about: ${input.topic}`,
        body: text,
        generatedAt: new Date().toISOString(),
      };
    }
  }
}