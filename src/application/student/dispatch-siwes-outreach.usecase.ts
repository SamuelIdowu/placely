// src/application/student/dispatch-siwes-outreach.usecase.ts
// Use case to dispatch a SIWES placement outreach application and email to an employer.

import type { IStudentProfileRepository } from '@/domain/ports/IStudentProfileRepository';
import type { IListingRepository } from '@/domain/ports/IListingRepository';
import type { IApplicationRepository } from '@/domain/ports/IApplicationRepository';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import type { ISiwesLetterGenerator } from '@/domain/ports/siwes-letter-generator.port';
import type { Application } from '@/domain/entities/application';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { createId } from '@paralleldrive/cuid2';

export interface DispatchSiwesOutreachDTO {
  studentProfileId: string;
  studentName: string;
  listingId?: string;
  targetCompany: string;
  targetEmail: string;
  targetLocation?: string;
  discipline?: string;
  durationMonths?: number;
  matricNumber?: string;
  note?: string;
  customLetterHtml?: string;
  appBaseUrl?: string;
}

export interface DispatchSiwesOutreachResult {
  application: Application;
  claimToken: string;
  claimUrl: string;
}

export class DispatchSiwesOutreachUseCase {
  constructor(
    private readonly studentRepo: IStudentProfileRepository,
    private readonly listingRepo: IListingRepository,
    private readonly applicationRepo: IApplicationRepository,
    private readonly emailService: EmailServicePort,
    private readonly letterGenerator: ISiwesLetterGenerator
  ) {}

  async execute(dto: DispatchSiwesOutreachDTO): Promise<DispatchSiwesOutreachResult> {
    if (!dto.targetEmail || !dto.targetEmail.includes('@')) {
      throw new ValidationError('A valid company contact email is required for SIWES outreach');
    }

    const student = await this.studentRepo.findById(dto.studentProfileId);
    if (!student) {
      throw new NotFoundError('StudentProfile', dto.studentProfileId);
    }

    let targetListingId = dto.listingId;

    // If no existing listing was provided, create a placeholder curated external listing for tracking
    if (!targetListingId) {
      const createdListing = await this.listingRepo.create({
        title: `SIWES Placement (${student.discipline})`,
        description: `Direct SIWES placement outreach to ${dto.targetCompany}.`,
        disciplines: [student.discipline],
        location: dto.targetLocation || 'Nigeria',
        isRemote: false,
        sourceType: 'CURATED_EXTERNAL',
        externalCompany: dto.targetCompany,
        contactEmail: dto.targetEmail,
      });
      targetListingId = createdListing.id;
    }

    const claimToken = createId();
    const durationMonths = dto.durationMonths ?? 6;

    // Use custom edited letter HTML if provided, otherwise generate from default template
    const letterHtml = dto.customLetterHtml || this.letterGenerator.generateLetterHtml({
      studentName: dto.studentName,
      matricNumber: dto.matricNumber,
      university: student.university,
      discipline: student.discipline,
      durationMonths,
      targetCompany: dto.targetCompany,
      targetLocation: dto.targetLocation,
      cgpa: student.cgpa,
      portfolioUrl: student.portfolioUrl,
      linkedinUrl: student.linkedinUrl,
      date: new Date(),
    });

    // Create Application record
    const application = await this.applicationRepo.create({
      listingId: targetListingId,
      studentId: student.id,
      note: dto.note,
      status: 'APPLIED',
      applicationType: 'SIWES_OUTREACH',
      outreachStatus: 'SENT',
      externalCompanyContact: dto.targetEmail,
      claimToken,
    });

    const baseUrl = dto.appBaseUrl || process.env.NEXTAUTH_URL || 'https://placely.app';
    const claimUrl = `${baseUrl}/claim?token=${claimToken}`;

    // Send email to employer HR
    await this.emailService.sendSiwesOutreachEmail({
      to: dto.targetEmail,
      companyName: dto.targetCompany,
      studentName: dto.studentName,
      university: student.university,
      discipline: student.discipline,
      letterHtml,
      claimUrl,
    });

    return {
      application,
      claimToken,
      claimUrl,
    };
  }
}
