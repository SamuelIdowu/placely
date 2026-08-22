// src/domain/value-objects/profile.ts
// Profile Zod validation schemas for Student and Employer profiles.

import { z } from 'zod';

export const studentProfileSchema = z.object({
  university: z.string().trim().min(1, 'University is required'),
  discipline: z.string().trim().min(1, 'Discipline is required'),
  cgpa: z
    .preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      z.number().min(0.0, 'CGPA must be at least 0.0').max(5.0, 'CGPA cannot exceed 5.0').optional(),
    ),
  resumeUrl: z
    .string()
    .trim()
    .url('Invalid URL format')
    .or(z.literal(''))
    .optional(),
  linkedinUrl: z
    .string()
    .trim()
    .url('Invalid LinkedIn URL')
    .or(z.literal(''))
    .optional(),
  portfolioUrl: z
    .string()
    .trim()
    .url('Invalid portfolio URL')
    .or(z.literal(''))
    .optional(),
  bio: z.string().trim().max(1000, 'Bio cannot exceed 1000 characters').optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

const cacNumberRegex = /^(RC|BN|IT|LL|CO|JE)\s?\d{6,7}$/i;

export const employerProfileSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required'),
  cacNumber: z
    .string()
    .trim()
    .min(1, 'CAC registration number is required')
    .regex(cacNumberRegex, 'Enter a valid CAC number (e.g. RC 1492084)'),
  description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional(),
  logoUrl: z
    .string()
    .trim()
    .url('Invalid logo URL')
    .or(z.literal(''))
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .url('Invalid website URL')
    .or(z.literal(''))
    .optional(),
});

export type EmployerProfileInput = z.infer<typeof employerProfileSchema>;
