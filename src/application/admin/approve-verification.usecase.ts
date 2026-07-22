// src/application/admin/approve-verification.usecase.ts

import type { VerificationRepositoryPort } from '@/domain/ports/verification-repository.port';
import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';

export interface ApproveVerificationInput {
  verificationRequestId: string;
  approve: boolean;
  adminNote?: string;
  reviewerEmail: string; // for audit
}

export interface ApproveVerificationOutput {
  success: boolean;
  error?: string;
}

export class ApproveVerificationUseCase {
  constructor(
    private readonly verifications: VerificationRepositoryPort,
    private readonly studentProfiles: StudentProfileRepositoryPort,
    private readonly employerProfiles: EmployerProfileRepositoryPort,
    private readonly email: EmailServicePort,
  ) {}

  async execute(input: ApproveVerificationInput): Promise<ApproveVerificationOutput> {
    const request = await this.verifications.findById(input.verificationRequestId);
    if (!request) return { success: false, error: 'Verification request not found' };

    const updated = input.approve
      ? request.approve(input.adminNote)
      : request.reject(input.adminNote ?? 'Rejected by admin');

    await this.verifications.update(updated);

    // Propagate status to owning profile
    if (request.toObject().studentProfileId) {
      const profile = await this.studentProfiles.findById(request.toObject().studentProfileId!);
      if (profile) {
        const updatedProfile = input.approve ? profile.markVerified() : profile.markRejected();
        await this.studentProfiles.update(updatedProfile);
      }
    } else if (request.toObject().employerProfileId) {
      const profile = await this.employerProfiles.findById(request.toObject().employerProfileId!);
      if (profile) {
        const updatedProfile = input.approve ? profile.markVerified() : profile.markRejected();
        await this.employerProfiles.update(updatedProfile);
      }
    }

    return { success: true };
  }
}
