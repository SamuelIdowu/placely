// src/domain/ports/IVerificationRequestRepository.ts

import type { VerificationRequest } from '@/domain/entities/verification-request';
import type { VerificationRepositoryPort } from './verification-repository.port';

export type IVerificationRequestRepository = VerificationRepositoryPort;
export type { VerificationRepositoryPort };

export interface PendingVerificationDetail {
  request: VerificationRequest;
  userName: string;
  userEmail: string;
  entityName: string; // University name for student, Company name for employer
}

export interface IVerificationRequestRepositoryInterface {
  findById(id: string): Promise<VerificationRequest | null>;
  findPending(): Promise<VerificationRequest[]>;
  findPendingAll(): Promise<PendingVerificationDetail[]>;
  findByStudentProfileId(studentProfileId: string): Promise<VerificationRequest | null>;
  findByEmployerProfileId(employerProfileId: string): Promise<VerificationRequest | null>;
  save(request: VerificationRequest): Promise<VerificationRequest>;
  update(request: VerificationRequest): Promise<VerificationRequest>;
  upsert(request: VerificationRequest): Promise<VerificationRequest>;
  approve(id: string, note?: string): Promise<VerificationRequest>;
  reject(id: string, note: string): Promise<VerificationRequest>;
}
