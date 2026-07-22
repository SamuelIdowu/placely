// src/application/employer/post-listing.usecase.ts

import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import { Listing } from '@/domain/entities/listing';
import { createId } from '@paralleldrive/cuid2';

export interface PostListingInput {
  employerProfileId: string;
  title: string;
  description: string;
  disciplines: string[];
  location: string;
  isRemote?: boolean;
}

export interface PostListingOutput {
  success: boolean;
  listingId?: string;
  error?: string;
}

export class PostListingUseCase {
  constructor(
    private readonly listings: ListingRepositoryPort,
    private readonly employerProfiles: EmployerProfileRepositoryPort,
  ) {}

  async execute(input: PostListingInput): Promise<PostListingOutput> {
    const employer = await this.employerProfiles.findById(input.employerProfileId);
    if (!employer) return { success: false, error: 'Employer profile not found' };
    if (!employer.canPostListings()) {
      return { success: false, error: 'Employer must be verified to post listings' };
    }

    const now = new Date();
    const listing = new Listing({
      id: createId(),
      employerProfileId: input.employerProfileId,
      title: input.title,
      description: input.description,
      disciplines: input.disciplines,
      location: input.location,
      isRemote: input.isRemote ?? false,
      status: 'OPEN',
      isModerated: false, // Admin must moderate before visible to students
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.listings.save(listing);
    return { success: true, listingId: saved.id };
  }
}
