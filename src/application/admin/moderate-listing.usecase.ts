// src/application/admin/moderate-listing.usecase.ts

import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';

export interface ModerateListingInput {
  listingId: string;
  isModerated: boolean;
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

    await this.listings.moderate(input.listingId, input.isModerated);

    return { success: true };
  }
}
