// src/infrastructure/db/company-directory.repository.ts
// Prisma implementation of ICompanyDirectoryRepository port using Prisma 7.

import { prisma } from '@/infrastructure/db/prisma.client';
import {
  ICompanyDirectoryRepository,
  CompanyDirectoryFilter,
} from '@/domain/ports/company-directory-repository.port';
import {
  CompanyDirectory,
  CompanyDirectoryProps,
} from '@/domain/entities/company-directory.entity';
import { createId } from '@paralleldrive/cuid2';

export class PrismaCompanyDirectoryRepository implements ICompanyDirectoryRepository {
  async create(data: Omit<CompanyDirectoryProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyDirectory> {
    const row = await prisma.companyDirectory.create({
      data: {
        id: createId(),
        name: data.name,
        industry: data.industry,
        location: data.location,
        address: data.address ?? null,
        contactEmail: data.contactEmail ?? null,
        phone: data.phone ?? null,
        websiteUrl: data.websiteUrl ?? null,
        isUniversityApproved: data.isUniversityApproved ?? false,
        approvedByUniversity: data.approvedByUniversity ?? null,
      },
    });

    return this.toDomain(row);
  }

  async bulkCreate(items: Array<Omit<CompanyDirectoryProps, 'id' | 'createdAt' | 'updatedAt'>>): Promise<number> {
    if (!items.length) return 0;

    const data = items.map((item) => ({
      id: createId(),
      name: item.name,
      industry: item.industry,
      location: item.location,
      address: item.address ?? null,
      contactEmail: item.contactEmail ?? null,
      phone: item.phone ?? null,
      websiteUrl: item.websiteUrl ?? null,
      isUniversityApproved: item.isUniversityApproved ?? false,
      approvedByUniversity: item.approvedByUniversity ?? null,
    }));

    const result = await prisma.companyDirectory.createMany({
      data,
      skipDuplicates: true,
    });

    return result.count;
  }

  async findById(id: string): Promise<CompanyDirectory | null> {
    const row = await prisma.companyDirectory.findUnique({
      where: { id },
    });
    return row ? this.toDomain(row) : null;
  }

  async findAll(filter?: CompanyDirectoryFilter): Promise<{ companies: CompanyDirectory[]; total: number }> {
    const limit = filter?.limit || 20;
    const offset = filter?.offset || 0;

    const where: {
      approvedByUniversity?: { contains: string; mode: 'insensitive' };
      industry?: { contains: string; mode: 'insensitive' };
      location?: { contains: string; mode: 'insensitive' };
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        industry?: { contains: string; mode: 'insensitive' };
        location?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (filter?.university) {
      where.approvedByUniversity = { contains: filter.university, mode: 'insensitive' };
    }

    if (filter?.industry) {
      where.industry = { contains: filter.industry, mode: 'insensitive' };
    }

    if (filter?.location) {
      where.location = { contains: filter.location, mode: 'insensitive' };
    }

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { industry: { contains: filter.search, mode: 'insensitive' } },
        { location: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.companyDirectory.findMany({
        where,
        orderBy: [{ isUniversityApproved: 'desc' }, { name: 'asc' }],
        take: limit,
        skip: offset,
      }),
      prisma.companyDirectory.count({ where }),
    ]);

    return {
      companies: rows.map((r) => this.toDomain(r)),
      total,
    };
  }

  async count(): Promise<number> {
    return prisma.companyDirectory.count();
  }

  private toDomain(row: {
    id: string;
    name: string;
    industry: string;
    location: string;
    address: string | null;
    contactEmail: string | null;
    phone: string | null;
    websiteUrl: string | null;
    isUniversityApproved: boolean;
    approvedByUniversity: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): CompanyDirectory {
    return new CompanyDirectory({
      id: row.id,
      name: row.name,
      industry: row.industry,
      location: row.location,
      address: row.address,
      contactEmail: row.contactEmail,
      phone: row.phone,
      websiteUrl: row.websiteUrl,
      isUniversityApproved: row.isUniversityApproved,
      approvedByUniversity: row.approvedByUniversity,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
