// src/domain/ports/IListingRepository.ts

import type { Listing, ListingProps, ListingSourceType } from '@/domain/entities/listing';
import type { ListingFilterInput } from '@/domain/value-objects/listing';

export interface PublicListingsResult {
  listings: ListingWithEmployer[];
  total: number;
}

export interface ListingWithEmployer {
  id: string;
  employerProfileId?: string | null;
  sourceType?: ListingSourceType;
  externalUrl?: string | null;
  contactEmail?: string | null;
  externalCompany?: string | null;
  externalLogoUrl?: string | null;
  companyName: string;
  companyLogoUrl?: string | null;
  companyVerificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  title: string;
  description: string;
  disciplines: string[];
  location: string;
  isRemote: boolean;
  status: 'OPEN' | 'CLOSED';
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  applicantCount?: number;
}

export interface EmployerListingItem {
  listing: Listing;
  applicantCount: number;
}

export interface IListingRepository {
  create(data: Partial<ListingProps> & { employerProfileId?: string | null; title: string; description: string; disciplines: string[]; location: string }): Promise<Listing>;
  save(listing: Listing): Promise<Listing>;
  findById(id: string): Promise<Listing | null>;
  findDetailsById(id: string): Promise<ListingWithEmployer | null>;
  findByEmployer(employerProfileId: string): Promise<EmployerListingItem[]>;
  findByEmployerProfileId?(employerProfileId: string): Promise<Listing[]>;
  findPublic(filters: ListingFilterInput): Promise<PublicListingsResult>;
  update(listing: Listing): Promise<Listing>;
  toggleStatus(id: string): Promise<Listing>;
  flagForModeration(id: string): Promise<void>;
  findAllForAdmin(filters?: { isModerated?: boolean; status?: 'OPEN' | 'CLOSED'; sourceType?: ListingSourceType }): Promise<ListingWithEmployer[]>;
  moderate(id: string, isModerated: boolean): Promise<Listing>;
}

