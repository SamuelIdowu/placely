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
import { Application, ApplicationStatus } from '@/domain/entities/application';
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

    const row = await prisma.application.create({
      data: {
        id: createId(),
        listingId: data.listingId,
        studentId: data.studentId,
        note: data.note,
        status: statusValue,
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

    return rows.map((row) => ({
      application: this.toDomain(row),
      listing: {
        id: row.listing.id,
        title: row.listing.title,
        location: row.listing.location,
        isRemote: row.listing.isRemote,
        employer: {
          id: row.listing.employerProfile.id,
          companyName: row.listing.employerProfile.companyName,
          verificationStatus: row.listing.employerProfile.verificationStatus,
        },
      },
    }));
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
      },
      update: {
        status: data.status,
        note: data.note,
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
    createdAt: Date;
    updatedAt: Date;
  }): Application {
    return new Application({
      id: row.id,
      listingId: row.listingId,
      studentId: row.studentId,
      status: row.status as ApplicationStatus,
      note: row.note ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
