// src/infrastructure/db/application.repository.ts
// Prisma implementation of ApplicationRepositoryPort.
// Maps DB rows → Domain entities (Prisma types never escape this class).

import { prisma } from '@/infrastructure/db/prisma.client';
import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import { Application, type ApplicationStatus, type ApplicationProps } from '@/domain/entities/application';

export class PrismaApplicationRepository implements ApplicationRepositoryPort {
  async findById(id: string): Promise<Application | null> {
    const row = await prisma.application.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByStudentId(studentId: string): Promise<Application[]> {
    const rows = await prisma.application.findMany({ where: { studentId } });
    return rows.map((r: any) => this.toDomain(r));
  }

  async findByListingId(listingId: string): Promise<Application[]> {
    const rows = await prisma.application.findMany({ where: { listingId } });
    return rows.map((r: any) => this.toDomain(r));
  }

  async findByListingAndStudent(listingId: string, studentId: string): Promise<Application | null> {
    const row = await prisma.application.findUnique({
      where: { listingId_studentId: { listingId, studentId } },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(application: Application): Promise<Application> {
    const data = application.toObject();
    const row = await prisma.application.create({
      data: {
        id: data.id,
        listingId: data.listingId,
        studentId: data.studentId,
        status: data.status,
        note: data.note,
      },
    });
    return this.toDomain(row);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const row = await prisma.application.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
    return this.toDomain(row);
  }

  // ── Mapping ─────────────────────────────────────────────────────────────────
  // Prisma row type never escapes this adapter
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
