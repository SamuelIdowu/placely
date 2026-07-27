// src/application/student/respond-to-offer.ts
// Use Case: Student responds to a placement offer (ACCEPT or DECLINE).

import type { IApplicationRepository } from '@/domain/ports/IApplicationRepository';
import type { ApplicationStatus } from '@/domain/entities/application';
import { validateTransition } from '@/domain/value-objects/application-state-machine';
import { NotFoundError, UnauthorizedError, ValidationError } from '@/lib/errors';

export interface RespondToOfferDTO {
  applicationId: string;
  studentProfileId: string;
  decision: 'ACCEPTED' | 'DECLINED';
}

export class RespondToOfferUseCase {
  constructor(private readonly applicationRepo: IApplicationRepository) {}

  async execute(dto: RespondToOfferDTO) {
    if (dto.decision !== 'ACCEPTED' && dto.decision !== 'DECLINED') {
      throw new ValidationError('Decision must be ACCEPTED or DECLINED');
    }

    const application = await this.applicationRepo.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application', dto.applicationId);
    }

    if (application.studentId !== dto.studentProfileId) {
      throw new UnauthorizedError('You are not authorized to respond to this offer');
    }

    // Validate state machine rule for STUDENT
    validateTransition(application.status, dto.decision as ApplicationStatus, 'STUDENT');

    const updated = await this.applicationRepo.updateStatus(dto.applicationId, dto.decision as ApplicationStatus);
    return { success: true, application: updated };
  }
}
