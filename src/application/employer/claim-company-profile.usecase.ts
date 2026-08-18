// src/application/employer/claim-company-profile.usecase.ts
// Use case for employers claiming their profile via a SIWES outreach magic token.

import type { IApplicationRepository } from '@/domain/ports/IApplicationRepository';
import type { IListingRepository } from '@/domain/ports/IListingRepository';
import type { IEmployerProfileRepository } from '@/domain/ports/IEmployerProfileRepository';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { NotFoundError, ValidationError } from '@/lib/errors';

export interface GetClaimDetailsResult {
  applicationId: string;
  claimToken: string;
  companyName: string;
  contactEmail: string | null;
  student: {
    id: string;
    name: string;
    university: string;
    discipline: string;
    resumeUrl: string | null;
    profileCompleteness: number;
    email: string;
  };
  listing: {
    id: string;
    title: string;
    location: string;
  };
}

export class ClaimCompanyProfileUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly listingRepo: IListingRepository,
    private readonly employerRepo: IEmployerProfileRepository,
    private readonly emailService: EmailServicePort
  ) {}

  async getClaimDetails(claimToken: string): Promise<GetClaimDetailsResult> {
    const claimData = await this.applicationRepo.findByClaimToken(claimToken);
    if (!claimData) {
      throw new NotFoundError('ClaimToken', claimToken);
    }

    const { application, student, listing } = claimData;
    const studentName = `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim() || 'Placely Student';

    return {
      applicationId: application.id,
      claimToken,
      companyName: listing.employer?.companyName || listing.externalCompany || 'Industry Partner',
      contactEmail: listing.contactEmail ?? null,
      student: {
        id: student.id,
        name: studentName,
        university: student.university,
        discipline: student.discipline,
        resumeUrl: student.resumeUrl,
        profileCompleteness: student.profileCompleteness,
        email: student.user.email,
      },
      listing: {
        id: listing.id,
        title: listing.title,
        location: listing.location,
      },
    };
  }

  async actionClaim(params: {
    claimToken: string;
    employerProfileId: string;
    action: 'SHORTLIST' | 'OFFER' | 'ACCEPT';
  }): Promise<{ success: boolean }> {
    const claimData = await this.applicationRepo.findByClaimToken(params.claimToken);
    if (!claimData) {
      throw new NotFoundError('ClaimToken', params.claimToken);
    }

    const { application, listing } = claimData;

    // Attach listing to the newly claimed employer profile
    const existingListing = await this.listingRepo.findById(listing.id);
    if (existingListing) {
      const updatedListing = new (existingListing.constructor as any)({
        ...existingListing.toObject(),
        employerProfileId: params.employerProfileId,
        sourceType: 'NATIVE',
      });
      await this.listingRepo.update(updatedListing);
    }

    // Update application status
    if (params.action === 'OFFER' || params.action === 'ACCEPT') {
      await this.applicationRepo.updateStatus(application.id, 'OFFERED');
    } else {
      await this.applicationRepo.updateStatus(application.id, 'SHORTLISTED');
    }

    await this.applicationRepo.updateOutreachStatus(application.id, 'ACCEPTED');

    return { success: true };
  }
}
