// src/domain/value-objects/application-state-machine.ts
// Application State Machine logic — pure domain value object.

import type { ApplicationStatus } from '../entities/application';

export class InvalidTransitionError extends Error {
  constructor(
    public readonly from: ApplicationStatus,
    public readonly to: ApplicationStatus,
    public readonly actorRole: 'EMPLOYER' | 'STUDENT'
  ) {
    super(`Invalid application status transition from ${from} to ${to} requested by ${actorRole}`);
    this.name = 'InvalidTransitionError';
  }
}

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return status === 'ACCEPTED' || status === 'DECLINED';
}

export interface TransitionRule {
  from: ApplicationStatus;
  to: ApplicationStatus;
  allowedRoles: ('EMPLOYER' | 'STUDENT')[];
}

export const VALID_TRANSITIONS: TransitionRule[] = [
  { from: 'APPLIED', to: 'SHORTLISTED', allowedRoles: ['EMPLOYER'] },
  { from: 'APPLIED', to: 'DECLINED', allowedRoles: ['EMPLOYER'] },
  { from: 'SHORTLISTED', to: 'OFFERED', allowedRoles: ['EMPLOYER'] },
  { from: 'SHORTLISTED', to: 'DECLINED', allowedRoles: ['EMPLOYER'] },
  { from: 'OFFERED', to: 'ACCEPTED', allowedRoles: ['STUDENT'] },
  { from: 'OFFERED', to: 'DECLINED', allowedRoles: ['STUDENT', 'EMPLOYER'] },
];

export function validateTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
  actorRole: 'EMPLOYER' | 'STUDENT'
): void {
  if (from === to) return;

  const matchingRule = VALID_TRANSITIONS.find(
    (rule) => rule.from === from && rule.to === to && rule.allowedRoles.includes(actorRole)
  );

  if (!matchingRule) {
    throw new InvalidTransitionError(from, to, actorRole);
  }
}
