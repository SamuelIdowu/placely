// src/infrastructure/db/verification.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { VerificationRepositoryPort, PaginatedPendingVerifications } from '@/domain/ports/verification-repository.port';
import { VerificationRequest, type VerificationStatus, type VerificationType } from '@/domain/entities/verification-request';

interface VerificationRow {
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
}

export interface PendingVerificationDetailRow {
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
    return rows.map((r: VerificationRow) => this.toDomain(r));
  }

  async findPendingAll(options?: { page?: number; limit?: number }): Promise<PaginatedPendingVerifications> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.verificationRequest.findMany({
        where: { status: 'PENDING' },
        skip,
        take: limit,
        include: {
          studentProfile: {
            include: {
              user: true,
            },
          },
          employerProfile: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items = rows.map((r) => {
      let applicantName = 'Unknown User';
      let applicantEmail = '';
      let entityName = '';
      let profileId = '';
      let profileType: 'STUDENT' | 'EMPLOYER' = 'STUDENT';

      if (r.studentProfile) {
        applicantEmail = r.studentProfile.user.email;
        applicantName = r.studentProfile.user.email.split('@')[0];
        entityName = r.studentProfile.university;
        profileId = r.studentProfile.id;
        profileType = 'STUDENT';
      } else if (r.employerProfile) {
        applicantEmail = r.employerProfile.user.email;
        applicantName = r.employerProfile.companyName;
        entityName = r.employerProfile.companyName;
        profileId = r.employerProfile.id;
        profileType = 'EMPLOYER';
      }

      return {
        id: r.id,
        type: r.type as 'SCHOOL_ID' | 'CAC_DOCUMENT',
        documentUrl: r.documentUrl,
        status: r.status as 'PENDING' | 'VERIFIED' | 'REJECTED',
        createdAt: r.createdAt,
        applicantName,
        applicantEmail,
        entityName,
        profileId,
        profileType,
      };
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
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
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async upsert(request: VerificationRequest): Promise<VerificationRequest> {
    const data = request.toObject();
    if (data.studentProfileId) {
      const row = await prisma.verificationRequest.upsert({
        where: { studentProfileId: data.studentProfileId },
        create: {
          id: data.id,
          type: data.type,
          documentUrl: data.documentUrl,
          status: data.status,
          adminNote: data.adminNote,
          studentProfileId: data.studentProfileId,
        },
        update: {
          type: data.type,
          documentUrl: data.documentUrl,
          status: data.status,
          adminNote: data.adminNote,
          updatedAt: new Date(),
        },
      });
      return this.toDomain(row);
    } else if (data.employerProfileId) {
      const row = await prisma.verificationRequest.upsert({
        where: { employerProfileId: data.employerProfileId },
        create: {
          id: data.id,
          type: data.type,
          documentUrl: data.documentUrl,
          status: data.status,
          adminNote: data.adminNote,
          employerProfileId: data.employerProfileId,
        },
        update: {
          type: data.type,
          documentUrl: data.documentUrl,
          status: data.status,
          adminNote: data.adminNote,
          updatedAt: new Date(),
        },
      });
      return this.toDomain(row);
    }
    return this.save(request);
  }

  private toDomain(row: VerificationRow): VerificationRequest {
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
