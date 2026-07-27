// src/domain/ports/verification-repository.port.ts

import type { VerificationRequest } from '@/domain/entities/verification-request';

export interface PendingVerificationDetail {
  id: string;
  type: 'SCHOOL_ID' | 'CAC_DOCUMENT';
  documentUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: Date;
  applicantName: string;
  applicantEmail: string;
  entityName: string;
  profileId: string;
  profileType: 'STUDENT' | 'EMPLOYER';
}

export interface PaginatedPendingVerifications {
  items: PendingVerificationDetail[];
  total: number;
  page: number;
  totalPages: number;
}

export interface VerificationRepositoryPort {
  findById(id: string): Promise<VerificationRequest | null>;
  findPending(): Promise<VerificationRequest[]>;
  findPendingAll?(options?: { page?: number; limit?: number }): Promise<PaginatedPendingVerifications>;
  findByStudentProfileId(studentProfileId: string): Promise<VerificationRequest | null>;
  findByEmployerProfileId(employerProfileId: string): Promise<VerificationRequest | null>;
  save(request: VerificationRequest): Promise<VerificationRequest>;
  update(request: VerificationRequest): Promise<VerificationRequest>;
  upsert(request: VerificationRequest): Promise<VerificationRequest>;
}
