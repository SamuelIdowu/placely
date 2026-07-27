// src/application/admin/approve-verification.usecase.ts

import type { VerificationRepositoryPort } from '@/domain/ports/verification-repository.port';
import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { prisma } from '@/infrastructure/db/prisma.client';

export interface ApproveVerificationInput {
  verificationRequestId: string;
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

    const updated = request.approve(input.adminNote);
    await this.verifications.update(updated);

    let recipientEmail: string | null = null;
    let recipientName: string = 'User';

    // Propagate status to owning profile
    const studentProfileId = request.toObject().studentProfileId;
    const employerProfileId = request.toObject().employerProfileId;

    if (studentProfileId) {
      const profile = await this.studentProfiles.findById(studentProfileId);
      if (profile) {
        const updatedProfile = profile.markVerified();
        await this.studentProfiles.update(updatedProfile);

        // Fetch user email for notification
        const user = await prisma.user.findUnique({ where: { id: profile.userId } });
        if (user) {
          recipientEmail = user.email;
          recipientName = profile.university;
        }
      }
    } else if (employerProfileId) {
      const profile = await this.employerProfiles.findById(employerProfileId);
      if (profile) {
        const updatedProfile = profile.markVerified();
        await this.employerProfiles.update(updatedProfile);

        const user = await prisma.user.findUnique({ where: { id: profile.userId } });
        if (user) {
          recipientEmail = user.email;
          recipientName = profile.companyName;
        }
      }
    }

    if (recipientEmail) {
      try {
        await this.email.sendVerificationResultEmail({
          to: recipientEmail,
          profileName: recipientName,
          result: 'VERIFIED',
          adminNote: input.adminNote,
        });
      } catch (err) {
        console.error('Failed to send verification approval email:', err);
      }
    }

    return { success: true };
  }
}
