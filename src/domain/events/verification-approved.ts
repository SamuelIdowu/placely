// src/domain/events/verification-approved.ts
// Domain event — raised when admin approves a verification request.

export interface VerificationApprovedEvent {
  readonly type: 'verification.approved';
  readonly verificationRequestId: string;
  readonly profileId: string;
  readonly profileType: 'STUDENT' | 'EMPLOYER';
  readonly occurredAt: Date;
}

export const createVerificationApprovedEvent = (
  verificationRequestId: string,
  profileId: string,
  profileType: 'STUDENT' | 'EMPLOYER',
): VerificationApprovedEvent => ({
  type: 'verification.approved',
  verificationRequestId,
  profileId,
  profileType,
  occurredAt: new Date(),
});
