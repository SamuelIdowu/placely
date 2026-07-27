// src/infrastructure/db/employer-profile.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import { EmployerProfile, type VerificationStatus } from '@/domain/entities/employer-profile';

export class PrismaEmployerProfileRepository implements EmployerProfileRepositoryPort {
  async findById(id: string): Promise<EmployerProfile | null> {
    const row = await prisma.employerProfile.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<EmployerProfile | null> {
    const row = await prisma.employerProfile.findUnique({ where: { userId } });
    return row ? this.toDomain(row) : null;
  }

  async save(profile: EmployerProfile): Promise<EmployerProfile> {
    const data = profile.toObject();
    const row = await prisma.employerProfile.create({
      data: {
        id: data.id,
        userId: data.userId,
        companyName: data.companyName,
        cacNumber: data.cacNumber,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        verificationStatus: data.verificationStatus,
      },
    });
    return this.toDomain(row);
  }

  async update(profile: EmployerProfile): Promise<EmployerProfile> {
    const data = profile.toObject();
    const row = await prisma.employerProfile.update({
      where: { id: data.id },
      data: {
        companyName: data.companyName,
        cacNumber: data.cacNumber,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        verificationStatus: data.verificationStatus,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async upsert(profile: EmployerProfile): Promise<EmployerProfile> {
    const data = profile.toObject();
    const row = await prisma.employerProfile.upsert({
      where: { userId: data.userId },
      create: {
        id: data.id,
        userId: data.userId,
        companyName: data.companyName,
        cacNumber: data.cacNumber,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        verificationStatus: data.verificationStatus,
      },
      update: {
        companyName: data.companyName,
        cacNumber: data.cacNumber,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        verificationStatus: data.verificationStatus,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    userId: string;
    companyName: string;
    cacNumber: string;
    description: string | null;
    logoUrl: string | null;
    websiteUrl: string | null;
    verificationStatus: string;
    createdAt: Date;
    updatedAt: Date;
  }): EmployerProfile {
    return new EmployerProfile({
      id: row.id,
      userId: row.userId,
      companyName: row.companyName,
      cacNumber: row.cacNumber,
      description: row.description ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      websiteUrl: row.websiteUrl ?? undefined,
      verificationStatus: row.verificationStatus as VerificationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
