export interface GenerateEmailInput {
  topic: string;
  tone: "professional" | "friendly" | "formal" | "casual" | "persuasive";
  length: "short" | "medium" | "long";
}

export interface GenerateEmailOutput {
  subject: string;
  body: string;
  generatedAt: string;
}

export interface AIEmailService {
  generate(input: GenerateEmailInput): Promise<GenerateEmailOutput>;
}