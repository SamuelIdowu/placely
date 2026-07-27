// src/domain/value-objects/application.ts
// Zod schemas for Application input validation.

import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'APPLIED',
  'SHORTLISTED',
  'OFFERED',
  'ACCEPTED',
  'DECLINED',
]);

export const submitApplicationSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  note: z.string().max(500, 'Cover note cannot exceed 500 characters').optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  actorRole: z.enum(['EMPLOYER', 'STUDENT']),
});

export type SubmitApplicationInputSchema = z.infer<typeof submitApplicationSchema>;
export type UpdateApplicationStatusInputSchema = z.infer<typeof updateApplicationStatusSchema>;
