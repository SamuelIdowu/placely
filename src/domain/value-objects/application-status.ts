// src/domain/value-objects/application-status.ts
// ApplicationStatus — valid transitions expressed as a state machine map.

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

// Maps each status → set of valid next states
export const APPLICATION_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ['SHORTLISTED', 'DECLINED'],
  SHORTLISTED: ['OFFERED', 'DECLINED'],
  OFFERED: ['ACCEPTED', 'DECLINED'],
  ACCEPTED: [],
  DECLINED: [],
};

export function isValidTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return APPLICATION_TRANSITIONS[from].includes(to);
}
