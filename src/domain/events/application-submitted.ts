// src/domain/events/application-submitted.ts
// Domain event — raised when a student submits an application.

export interface ApplicationSubmittedEvent {
  readonly type: 'application.submitted';
  readonly applicationId: string;
  readonly listingId: string;
  readonly studentId: string;
  readonly employerProfileId: string;
  readonly occurredAt: Date;
}

export const createApplicationSubmittedEvent = (
  applicationId: string,
  listingId: string,
  studentId: string,
  employerProfileId: string,
): ApplicationSubmittedEvent => ({
  type: 'application.submitted',
  applicationId,
  listingId,
  studentId,
  employerProfileId,
  occurredAt: new Date(),
});
