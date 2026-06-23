import type { AIEmailService } from "./types";
import { GeminiEmailService } from "./gemini.service";

function createEmailService(): AIEmailService {
  // Тут легко замінити на OpenAI / Claude / OpenRouter
  return new GeminiEmailService();
}

export const emailService = createEmailService();
export type { AIEmailService, GenerateEmailInput, GenerateEmailOutput } from "./types";