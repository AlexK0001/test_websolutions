export interface User {
  _id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  createdAt: string;
  emailsGeneratedToday: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface GenerateEmailRequest {
  topic: string;
  tone: "professional" | "friendly" | "formal" | "casual" | "persuasive";
  length: "short" | "medium" | "long";
}

export interface GenerateEmailResponse {
  subject: string;
  body: string;
  generatedAt: string;
}