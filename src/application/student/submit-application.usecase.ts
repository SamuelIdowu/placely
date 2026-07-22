// src/application/student/submit-application.usecase.ts

import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import type { ListingRepositoryPort } from '@/domain/ports/listing-repository.port';
import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { Application } from '@/domain/entities/application';
import { NotFoundError, DomainError } from '@/lib/errors';
import { createId } from '@paralleldrive/cuid2';

export interface SubmitApplicationInput {
  listingId: string;
  studentId: string;  // StudentProfile.id
  note?: string;
}

export interface SubmitApplicationOutput {
  success: boolean;
  applicationId?: string;
  error?: string;
}

export class SubmitApplicationUseCase {
  constructor(
    private readonly applications: ApplicationRepositoryPort,
    private readonly listings: ListingRepositoryPort,
    private readonly studentProfiles: StudentProfileRepositoryPort,
    private readonly email: EmailServicePort,
  ) {}

  async execute(input: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
    const listing = await this.listings.findById(input.listingId);
    if (!listing) return { success: false, error: 'Listing not found' };
    if (!listing.isOpen) return { success: false, error: 'Listing is not open for applications' };

    const profile = await this.studentProfiles.findById(input.studentId);
    if (!profile) return { success: false, error: 'Student profile not found' };
    if (!profile.canApply()) {
      return { success: false, error: 'Profile must be verified and at least 50% complete to apply' };
    }

    const existing = await this.applications.findByListingAndStudent(input.listingId, input.studentId);
    if (existing) return { success: false, error: 'Already applied to this listing' };

    const now = new Date();
    const application = new Application({
      id: createId(),
      listingId: input.listingId,
      studentId: input.studentId,
      status: 'APPLIED',
      note: input.note,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.applications.save(application);
    return { success: true, applicationId: saved.id };
  }
}
