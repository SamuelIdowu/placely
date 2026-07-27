// src/application/employer/get-applicants.ts
// Use Case: Employer retrieves applicants for a listing with profile metrics.

import type { IApplicationRepository, ApplicationWithStudentProfile } from '@/domain/ports/IApplicationRepository';
import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';
import { NotFoundError, UnauthorizedError } from '@/lib/errors';

export interface GetApplicantsDTO {
  listingId: string;
  employerProfileId: string;
}

export class GetApplicantsUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly listingRepo: ListingRepositoryPort
  ) {}

  async execute(dto: GetApplicantsDTO): Promise<{ listingTitle: string; applicants: ApplicationWithStudentProfile[] }> {
    const listing = await this.listingRepo.findById(dto.listingId);
    if (!listing) {
      throw new NotFoundError('Listing', dto.listingId);
    }

    if (listing.employerProfileId !== dto.employerProfileId) {
      throw new UnauthorizedError('You do not own this listing');
    }

    const applicants = await this.applicationRepo.findByListing(dto.listingId);
    return {
      listingTitle: listing.title,
      applicants,
    };
  }
}
