// src/domain/events/ApplicationStatusChanged.ts
// Domain Event interface for application status changes.

import type { ApplicationStatus } from '../entities/application';

export interface ApplicationStatusChangedEvent {
  applicationId: string;
  oldStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  actorId: string;
  timestamp: Date;
}
