// src/domain/ports/verification-repository.port.ts

import type { VerificationRequest } from '@/domain/entities/verification-request';

export interface VerificationRepositoryPort {
  findById(id: string): Promise<VerificationRequest | null>;
  findPending(): Promise<VerificationRequest[]>;
  findByStudentProfileId(studentProfileId: string): Promise<VerificationRequest | null>;
  findByEmployerProfileId(employerProfileId: string): Promise<VerificationRequest | null>;
  save(request: VerificationRequest): Promise<VerificationRequest>;
  update(request: VerificationRequest): Promise<VerificationRequest>;
}
