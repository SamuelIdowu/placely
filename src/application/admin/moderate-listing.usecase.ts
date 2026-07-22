// src/application/admin/moderate-listing.usecase.ts

import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';

export interface ModerateListingInput {
  listingId: string;
  approve: boolean;
}

export interface ModerateListingOutput {
  success: boolean;
  error?: string;
}

export class ModerateListingUseCase {
  constructor(private readonly listings: ListingRepositoryPort) {}

  async execute(input: ModerateListingInput): Promise<ModerateListingOutput> {
    const listing = await this.listings.findById(input.listingId);
    if (!listing) return { success: false, error: 'Listing not found' };

    if (input.approve) {
      const moderated = listing.moderate();
      await this.listings.update(moderated);
    } else {
      const closed = listing.close();
      await this.listings.update(closed);
    }

    return { success: true };
  }
}
