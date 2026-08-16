// src/infrastructure/db/ApplicationRepository.ts
// Prisma implementation of IApplicationRepository port using Prisma 7.
// Prisma client and models NEVER escape this repository.

import { prisma } from '@/infrastructure/db/prisma.client';
import {
  IApplicationRepository,
  CreateApplicationDTO,
  ApplicationWithDetails,
  ApplicationWithStudentProfile,
} from '@/domain/ports/IApplicationRepository';
import { Application, ApplicationStatus, ApplicationType, OutreachStatus } from '@/domain/entities/application';
import { DuplicateApplicationError } from '@/lib/errors';
import { createId } from '@paralleldrive/cuid2';

export class PrismaApplicationRepository implements IApplicationRepository {
  async existsByListingAndStudent(listingId: string, studentId: string): Promise<boolean> {
    const count = await prisma.application.count({
      where: { listingId, studentId },
    });
    return count > 0;
  }

  async create(data: CreateApplicationDTO): Promise<Application> {
    const exists = await this.existsByListingAndStudent(data.listingId, data.studentId);
    if (exists) {
      throw new DuplicateApplicationError();
    }

    const statusValue = (data.status ?? 'APPLIED') as ApplicationStatus;
    const applicationTypeValue = (data.applicationType ?? 'NATIVE') as 'NATIVE' | 'EXTERNAL_PORTAL' | 'SIWES_OUTREACH';
    const outreachStatusValue = data.outreachStatus as ('DRAFT' | 'LETTER_GENERATED' | 'SENT' | 'FOLLOWED_UP' | 'ACCEPTED' | 'REJECTED') | undefined;

    const row = await prisma.application.create({
      data: {
        id: createId(),
        listingId: data.listingId,
        studentId: data.studentId,
        note: data.note,
        status: statusValue,
        applicationType: applicationTypeValue,
        outreachStatus: outreachStatusValue ?? null,
        outreachLetterUrl: data.outreachLetterUrl ?? null,
        externalCompanyContact: data.externalCompanyContact ?? null,
        claimToken: data.claimToken ?? null,
      },
    });

    return this.toDomain(row);
  }

  async findById(id: string): Promise<Application | null> {
    const row = await prisma.application.findUnique({
      where: { id },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByClaimToken(claimToken: string): Promise<{ application: Application; student: ApplicationWithStudentProfile['student']; listing: ApplicationWithDetails['listing'] } | null> {
    const row = await prisma.application.findUnique({
      where: { claimToken },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            isRemote: true,
            sourceType: true,
            externalCompany: true,
            externalUrl: true,
            contactEmail: true,
            employerProfile: {
              select: {
                id: true,
                companyName: true,
                verificationStatus: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            userId: true,
            university: true,
            discipline: true,
            resumeUrl: true,
            profileCompleteness: true,
            verificationStatus: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!row) return null;

    const isExternal = row.listing.sourceType === 'CURATED_EXTERNAL';
    const companyName = isExternal
      ? (row.listing.externalCompany ?? 'Industry Partner')
      : (row.listing.employerProfile?.companyName ?? 'Corporate Partner');

    return {
      application: this.toDomain(row),
      student: {
        id: row.student.id,
        userId: row.student.userId,
        university: row.student.university,
        discipline: row.student.discipline,
        resumeUrl: row.student.resumeUrl,
        profileCompleteness: row.student.profileCompleteness,
        verificationStatus: row.student.verificationStatus,
        user: {
          firstName: row.student.user.firstName,
          lastName: row.student.user.lastName,
          email: row.student.user.email,
        },
      },
      listing: {
        id: row.listing.id,
        title: row.listing.title,
        location: row.listing.location,
        isRemote: row.listing.isRemote,
        sourceType: row.listing.sourceType as 'NATIVE' | 'CURATED_EXTERNAL',
        externalCompany: row.listing.externalCompany,
        externalUrl: row.listing.externalUrl,
        contactEmail: row.listing.contactEmail,
        employer: {
          id: row.listing.employerProfile?.id ?? '',
          companyName,
          verificationStatus: row.listing.employerProfile?.verificationStatus ?? 'VERIFIED',
        },
      },
    };
  }

  async findByStudent(studentId: string): Promise<ApplicationWithDetails[]> {
    const rows = await prisma.application.findMany({
      where: { studentId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            isRemote: true,
            sourceType: true,
            externalCompany: true,
            externalUrl: true,
            contactEmail: true,
            employerProfile: {
              select: {
                id: true,
                companyName: true,
                verificationStatus: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((row) => {
      const isExternal = row.listing.sourceType === 'CURATED_EXTERNAL';
      const companyName = isExternal
        ? (row.listing.externalCompany ?? 'Industry Partner')
        : (row.listing.employerProfile?.companyName ?? 'Corporate Partner');

      return {
        application: this.toDomain(row),
        listing: {
          id: row.listing.id,
          title: row.listing.title,
          location: row.listing.location,
          isRemote: row.listing.isRemote,
          sourceType: row.listing.sourceType as 'NATIVE' | 'CURATED_EXTERNAL',
          externalCompany: row.listing.externalCompany,
          externalUrl: row.listing.externalUrl,
          contactEmail: row.listing.contactEmail,
          employer: {
            id: row.listing.employerProfile?.id ?? '',
            companyName,
            verificationStatus: row.listing.employerProfile?.verificationStatus ?? 'VERIFIED',
          },
        },
      };
    });
  }

  async findByListing(listingId: string): Promise<ApplicationWithStudentProfile[]> {
    const rows = await prisma.application.findMany({
      where: { listingId },
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            university: true,
            discipline: true,
            resumeUrl: true,
            profileCompleteness: true,
            verificationStatus: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        student: {
          profileCompleteness: 'desc',
        },
      },
    });

    return rows.map((row) => ({
      application: this.toDomain(row),
      student: {
        id: row.student.id,
        userId: row.student.userId,
        university: row.student.university,
        discipline: row.student.discipline,
        resumeUrl: row.student.resumeUrl,
        profileCompleteness: row.student.profileCompleteness,
        verificationStatus: row.student.verificationStatus,
        user: {
          firstName: row.student.user.firstName,
          lastName: row.student.user.lastName,
          email: row.student.user.email,
        },
      },
    }));
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const row = await prisma.application.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async updateOutreachStatus(id: string, status: OutreachStatus): Promise<Application> {
    const row = await prisma.application.update({
      where: { id },
      data: {
        outreachStatus: status,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  // Also support findByStudentId and findByListingId for backwards compatibility
  async findByStudentId(studentId: string): Promise<Application[]> {
    const rows = await prisma.application.findMany({
      where: { studentId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findByListingId(listingId: string): Promise<Application[]> {
    const rows = await prisma.application.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findByListingAndStudent(listingId: string, studentId: string): Promise<Application | null> {
    const row = await prisma.application.findUnique({
      where: { listingId_studentId: { listingId, studentId } },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(application: Application): Promise<Application> {
    const data = application.toObject();
    const row = await prisma.application.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        listingId: data.listingId,
        studentId: data.studentId,
        status: data.status,
        note: data.note,
        applicationType: data.applicationType as 'NATIVE' | 'EXTERNAL_PORTAL' | 'SIWES_OUTREACH',
        outreachStatus: data.outreachStatus as ('DRAFT' | 'LETTER_GENERATED' | 'SENT' | 'FOLLOWED_UP' | 'ACCEPTED' | 'REJECTED') | null,
        outreachLetterUrl: data.outreachLetterUrl ?? null,
        externalCompanyContact: data.externalCompanyContact ?? null,
        claimToken: data.claimToken ?? null,
      },
      update: {
        status: data.status,
        note: data.note,
        applicationType: data.applicationType as 'NATIVE' | 'EXTERNAL_PORTAL' | 'SIWES_OUTREACH',
        outreachStatus: data.outreachStatus as ('DRAFT' | 'LETTER_GENERATED' | 'SENT' | 'FOLLOWED_UP' | 'ACCEPTED' | 'REJECTED') | null,
        outreachLetterUrl: data.outreachLetterUrl ?? null,
        externalCompanyContact: data.externalCompanyContact ?? null,
        claimToken: data.claimToken ?? null,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    listingId: string;
    studentId: string;
    status: string;
    note: string | null;
    applicationType?: string;
    outreachStatus?: string | null;
    outreachLetterUrl?: string | null;
    externalCompanyContact?: string | null;
    claimToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Application {
    return new Application({
      id: row.id,
      listingId: row.listingId,
      studentId: row.studentId,
      status: row.status as ApplicationStatus,
      note: row.note ?? undefined,
      applicationType: (row.applicationType ?? 'NATIVE') as ApplicationType,
      outreachStatus: (row.outreachStatus as OutreachStatus) ?? null,
      outreachLetterUrl: row.outreachLetterUrl ?? null,
      externalCompanyContact: row.externalCompanyContact ?? null,
      claimToken: row.claimToken ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

