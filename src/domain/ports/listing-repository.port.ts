// src/domain/ports/listing-repository.port.ts

import type { Listing } from '@/domain/entities/listing';

export interface ListingFilter {
  discipline?: string;
  location?: string;
  isRemote?: boolean;
}

export interface ListingRepositoryPort {
  findById(id: string): Promise<Listing | null>;
  findByEmployerProfileId(employerProfileId: string): Promise<Listing[]>;
  findOpen(filter?: ListingFilter): Promise<Listing[]>;
  save(listing: Listing): Promise<Listing>;
  update(listing: Listing): Promise<Listing>;
}
