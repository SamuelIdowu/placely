// src/application/student/submit-application.ts
// Use Case: Student submits application to open listing.

import type { IApplicationRepository } from '@/domain/ports/IApplicationRepository';
import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';
import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { submitApplicationSchema } from '@/domain/value-objects/application';
import { DuplicateApplicationError, ListingClosedError, UnauthorizedError, ValidationError } from '@/lib/errors';
import { Application } from '@/domain/entities/application';

export interface SubmitApplicationDTO {
  studentProfileId: string;
  listingId: string;
  note?: string;
}

export interface SubmitApplicationResult {
  success: boolean;
  application?: Application;
  error?: string;
}

export class SubmitApplicationUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly listingRepo: ListingRepositoryPort,
    private readonly studentProfileRepo: StudentProfileRepositoryPort,
    private readonly emailService: EmailServicePort,
    private readonly employerProfileRepo?: EmployerProfileRepositoryPort
  ) {}

  async execute(dto: SubmitApplicationDTO): Promise<SubmitApplicationResult> {
    const validated = submitApplicationSchema.safeParse({
      listingId: dto.listingId,
      note: dto.note,
    });

    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message ?? 'Invalid application input');
    }

    const studentProfile = await this.studentProfileRepo.findById(dto.studentProfileId);
    if (!studentProfile) {
      throw new UnauthorizedError('Student profile not found');
    }

    if (studentProfile.verificationStatus !== 'VERIFIED') {
      return {
        success: false,
        error: 'Your profile must be verified before submitting applications.',
      };
    }

    if (studentProfile.profileCompleteness < 50) {
      return {
        success: false,
        error: 'Your profile must be at least 50% complete before applying.',
      };
    }

    const listing = await this.listingRepo.findById(dto.listingId);
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }

    if (!listing.isOpen) {
      throw new ListingClosedError();
    }

    const hasApplied = await this.applicationRepo.existsByListingAndStudent(dto.listingId, dto.studentProfileId);
    if (hasApplied) {
      throw new DuplicateApplicationError();
    }

    const application = await this.applicationRepo.create({
      listingId: dto.listingId,
      studentId: dto.studentProfileId,
      note: dto.note,
      status: 'APPLIED',
    });

    // Notify employer if profiles are resolvable
    try {
      if (this.employerProfileRepo && listing.employerProfileId) {
        const employer = await this.employerProfileRepo.findById(listing.employerProfileId);
        if (employer) {
          const appUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://placely.ng'}/employer/listings/${listing.id}/applicants`;
          await this.emailService.sendNewApplicationEmail({
            to: 'employer@company.com',
            employerName: employer.companyName,
            listingTitle: listing.title,
            applicantName: `${studentProfile.university} Student (${studentProfile.discipline})`,
            applicationUrl: appUrl,
          });
        }
      }
    } catch {
      // Non-blocking notification failure log
    }

    return { success: true, application };
  }
}
