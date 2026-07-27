// src/domain/value-objects/auth.ts
// Auth validation schemas using Zod.

import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpStudentSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  university: z.string().trim().min(1, 'University is required'),
  discipline: z.string().trim().min(1, 'Discipline is required'),
  cgpa: z
    .number()
    .min(0.0, 'CGPA must be at least 0.0')
    .max(5.0, 'CGPA cannot exceed 5.0')
    .optional(),
  bio: z.string().optional(),
});

export type SignUpStudentInput = z.infer<typeof signUpStudentSchema>;

export const signUpEmployerSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().trim().min(1, 'Company name is required'),
  cacNumber: z.string().trim().min(1, 'CAC registration number is required'),
  description: z.string().optional(),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid website URL')
    .or(z.literal(''))
    .optional(),
});

export type SignUpEmployerInput = z.infer<typeof signUpEmployerSchema>;
