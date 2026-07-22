// src/infrastructure/db/verification.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { VerificationRepositoryPort } from '@/domain/ports/verification-repository.port';
import { VerificationRequest, type VerificationStatus, type VerificationType } from '@/domain/entities/verification-request';

export class PrismaVerificationRepository implements VerificationRepositoryPort {
  async findById(id: string): Promise<VerificationRequest | null> {
    const row = await prisma.verificationRequest.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findPending(): Promise<VerificationRequest[]> {
    const rows = await prisma.verificationRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r: any) => this.toDomain(r));
  }

  async findByStudentProfileId(studentProfileId: string): Promise<VerificationRequest | null> {
    const row = await prisma.verificationRequest.findUnique({ where: { studentProfileId } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmployerProfileId(employerProfileId: string): Promise<VerificationRequest | null> {
    const row = await prisma.verificationRequest.findUnique({ where: { employerProfileId } });
    return row ? this.toDomain(row) : null;
  }

  async save(request: VerificationRequest): Promise<VerificationRequest> {
    const data = request.toObject();
    const row = await prisma.verificationRequest.create({
      data: {
        id: data.id,
        type: data.type,
        documentUrl: data.documentUrl,
        status: data.status,
        studentProfileId: data.studentProfileId,
        employerProfileId: data.employerProfileId,
      },
    });
    return this.toDomain(row);
  }

  async update(request: VerificationRequest): Promise<VerificationRequest> {
    const data = request.toObject();
    const row = await prisma.verificationRequest.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNote: data.adminNote,
        reviewedAt: data.reviewedAt,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    type: string;
    documentUrl: string;
    status: string;
    adminNote: string | null;
    reviewedAt: Date | null;
    studentProfileId: string | null;
    employerProfileId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): VerificationRequest {
    return new VerificationRequest({
      id: row.id,
      type: row.type as VerificationType,
      documentUrl: row.documentUrl,
      status: row.status as VerificationStatus,
      adminNote: row.adminNote ?? undefined,
      reviewedAt: row.reviewedAt ?? undefined,
      studentProfileId: row.studentProfileId ?? undefined,
      employerProfileId: row.employerProfileId ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
