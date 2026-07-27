// src/application/employer/toggle-listing-status.ts

import type { IListingRepository } from '@/domain/ports/IListingRepository';
import type { Listing } from '@/domain/entities/listing';

export interface ToggleListingStatusCommand {
  listingId: string;
  employerProfileId: string;
}

export class ToggleListingStatusUseCase {
  constructor(private readonly listingRepo: IListingRepository) {}

  async execute(input: ToggleListingStatusCommand): Promise<Listing> {
    const existingListing = await this.listingRepo.findById(input.listingId);
    if (!existingListing) {
      throw new Error('Listing not found');
    }

    if (existingListing.employerProfileId !== input.employerProfileId) {
      throw new Error('Unauthorized: You do not own this listing');
    }

    return this.listingRepo.toggleStatus(input.listingId);
  }
}
