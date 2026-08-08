// src/application/student/get-saved-listings.ts

import type { ISavedListingRepository } from '@/domain/ports/ISavedListingRepository';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

export class GetSavedListingsUseCase {
  constructor(private readonly savedListingRepo: ISavedListingRepository) {}

  async execute(studentProfileId: string): Promise<ListingWithEmployer[]> {
    return this.savedListingRepo.findSavedByStudent(studentProfileId);
  }

  async getSavedIds(studentProfileId: string): Promise<string[]> {
    return this.savedListingRepo.findSavedListingIds(studentProfileId);
  }
}
