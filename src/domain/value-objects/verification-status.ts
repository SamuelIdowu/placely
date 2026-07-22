// src/domain/value-objects/verification-status.ts
// VerificationStatus value object.

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export function isTerminalVerificationStatus(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'REJECTED';
}
