// src/application/employer/update-application-status.ts
// Use Case: Employer updates applicant status (SHORTLIST, OFFER, DECLINE).

import type { IApplicationRepository } from '@/domain/ports/IApplicationRepository';
import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import type { ApplicationStatus } from '@/domain/entities/application';
import { validateTransition } from '@/domain/value-objects/application-state-machine';
import { NotFoundError, UnauthorizedError } from '@/lib/errors';

export interface UpdateApplicationStatusDTO {
  applicationId: string;
  employerProfileId: string;
  newStatus: ApplicationStatus;
}

export class UpdateApplicationStatusUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly listingRepo: ListingRepositoryPort,
    private readonly emailService: EmailServicePort
  ) {}

  async execute(dto: UpdateApplicationStatusDTO) {
    const application = await this.applicationRepo.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application', dto.applicationId);
    }

    const listing = await this.listingRepo.findById(application.listingId);
    if (!listing) {
      throw new NotFoundError('Listing', application.listingId);
    }

    if (listing.employerProfileId !== dto.employerProfileId) {
      throw new UnauthorizedError('You do not own the listing for this application');
    }

    // State machine check for EMPLOYER
    validateTransition(application.status, dto.newStatus, 'EMPLOYER');

    const updated = await this.applicationRepo.updateStatus(dto.applicationId, dto.newStatus);

    // Send email notification to student
    try {
      const applicants = await this.applicationRepo.findByListing(application.listingId);
      const targetApplicant = applicants.find((a) => a.application.id === dto.applicationId);

      if (targetApplicant?.student.user.email) {
        const appUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://placely.ng'}/applications/${application.id}`;
        await this.emailService.sendStatusChangeEmail({
          to: targetApplicant.student.user.email,
          applicantName: `${targetApplicant.student.university} Student`,
          listingTitle: listing.title,
          newStatus: dto.newStatus,
          applicationUrl: appUrl,
        });
      }
    } catch {
      // Non-blocking notification failure log
    }

    return { success: true, application: updated };
  }
}
