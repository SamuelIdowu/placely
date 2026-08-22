// src/domain/value-objects/listing.ts
import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title cannot exceed 120 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  disciplines: z
    .array(z.string())
    .min(1, 'Select at least one engineering discipline'),
  location: z.string().min(2, 'Location is required'),
  isRemote: z.boolean().default(false),
  stipendAmount: z.coerce.number().int().positive().optional().nullable(),
  isStipendNegotiable: z.boolean().optional().default(false),
  durationWeeks: z.coerce.number().int().positive().optional().nullable(),
  requirements: z.string().optional().nullable(),
  applicationDeadline: z.coerce.date().optional().nullable(),
  maxApplicants: z.coerce.number().int().positive().optional().nullable(),
  sourceType: z.enum(['NATIVE', 'CURATED_EXTERNAL']).optional().default('NATIVE'),
  externalUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  externalCompany: z.string().optional().nullable(),
  externalLogoUrl: z.string().url().optional().nullable(),
});

export const updateListingSchema = createListingSchema.partial();

export const listingFilterSchema = z.object({
  discipline: z.string().optional(),
  location: z.string().optional(),
  keyword: z.string().optional(),
  isRemote: z.boolean().optional(),
  sourceType: z.enum(['ALL', 'NATIVE', 'CURATED_EXTERNAL']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export type CreateListingInput = z.input<typeof createListingSchema>;
export type UpdateListingInput = z.input<typeof updateListingSchema>;
export type ListingFilterInput = z.input<typeof listingFilterSchema>;
