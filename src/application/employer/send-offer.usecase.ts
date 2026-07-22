// src/application/employer/send-offer.usecase.ts
// From setup guide Section 7 — employer sends offer to shortlisted applicant.

import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';

export interface SendOfferInput {
  applicationId: string;
  employerProfileId: string; // authorization check
  listingTitle: string;
  studentEmail: string;
  applicantName: string;
}

export interface SendOfferOutput {
  success: boolean;
  error?: string;
}

export class SendOfferUseCase {
  constructor(
    private readonly applications: ApplicationRepositoryPort,
    private readonly email: EmailServicePort,
  ) {}

  async execute(input: SendOfferInput): Promise<SendOfferOutput> {
    const application = await this.applications.findById(input.applicationId);
    if (!application) return { success: false, error: 'Application not found' };

    let updated;
    try {
      updated = application.sendOffer(); // Domain rule enforced here
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }

    await this.applications.updateStatus(application.id, updated.status);

    await this.email.sendStatusChangeEmail({
      to: input.studentEmail,
      applicantName: input.applicantName,
      listingTitle: input.listingTitle,
      newStatus: 'OFFERED',
      applicationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/applications/${application.id}`,
    });

    return { success: true };
  }
}
