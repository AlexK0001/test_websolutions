import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const generateEmailSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(500),
  tone: z.enum(["professional", "friendly", "formal", "casual", "persuasive"]),
  length: z.enum(["short", "medium", "long"]),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerateEmailInput = z.infer<typeof generateEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;