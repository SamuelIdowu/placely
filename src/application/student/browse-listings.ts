// src/application/student/browse-listings.ts

import type { IListingRepository, PublicListingsResult } from '@/domain/ports/IListingRepository';
import { listingFilterSchema, type ListingFilterInput } from '@/domain/value-objects/listing';

export class BrowseListingsUseCase {
  constructor(private readonly listingRepo: IListingRepository) {}

  async execute(input: ListingFilterInput): Promise<PublicListingsResult> {
    const validatedFilters = listingFilterSchema.parse(input);
    return this.listingRepo.findPublic(validatedFilters);
  }
}
