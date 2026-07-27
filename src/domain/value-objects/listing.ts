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
});

export const updateListingSchema = createListingSchema.partial();

export const listingFilterSchema = z.object({
  discipline: z.string().optional(),
  location: z.string().optional(),
  keyword: z.string().optional(),
  isRemote: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingFilterInput = z.infer<typeof listingFilterSchema>;
