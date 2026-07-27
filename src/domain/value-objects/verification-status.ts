// src/domain/value-objects/verification-status.ts
// VerificationStatus value object with status helper functions.

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export function isVerified(status: VerificationStatus): boolean {
  return status === 'VERIFIED';
}

export function isPending(status: VerificationStatus): boolean {
  return status === 'PENDING';
}

export function isRejected(status: VerificationStatus): boolean {
  return status === 'REJECTED';
}

export function isTerminalVerificationStatus(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'REJECTED';
}
