// src/domain/ports/ISavedListingRepository.ts

import type { SavedListing } from '@/domain/entities/saved-listing';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

export interface ISavedListingRepository {
  save(studentProfileId: string, listingId: string): Promise<SavedListing>;
  remove(studentProfileId: string, listingId: string): Promise<void>;
  isSaved(studentProfileId: string, listingId: string): Promise<boolean>;
  findSavedByStudent(studentProfileId: string): Promise<ListingWithEmployer[]>;
  findSavedListingIds(studentProfileId: string): Promise<string[]>;
}
