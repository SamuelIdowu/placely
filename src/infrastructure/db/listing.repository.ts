// src/infrastructure/db/listing.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type {
  IListingRepository,
  PublicListingsResult,
  ListingWithEmployer,
  EmployerListingItem,
} from '@/domain/ports/IListingRepository';
import { Listing, type ListingStatus, type ListingSourceType, type ListingProps } from '@/domain/entities/listing';
import type { ListingFilterInput } from '@/domain/value-objects/listing';
import { createId } from '@paralleldrive/cuid2';

interface ListingDbRow {
  id: string;
  employerProfileId: string | null;
  sourceType: string;
  externalUrl: string | null;
  contactEmail: string | null;
  externalCompany: string | null;
  externalLogoUrl: string | null;
  title: string;
  description: string;
  disciplines: string[];
  location: string;
  isRemote: boolean;
  stipendAmount: number | null;
  isStipendNegotiable: boolean;
  durationWeeks: number | null;
  requirements: string | null;
  applicationDeadline: Date | null;
  maxApplicants: number | null;
  status: string;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaListingRepository implements IListingRepository {
  async findById(id: string): Promise<Listing | null> {
    try {
      const row = await prisma.listing.findUnique({ where: { id } });
      return row ? this.toDomain(row as unknown as ListingDbRow) : null;
    } catch (err) {
      console.error(`[PrismaListingRepository] findById(${id}) error:`, err);
      return null;
    }
  }

  async findDetailsById(id: string): Promise<ListingWithEmployer | null> {
    try {
      const row = await prisma.listing.findUnique({
        where: { id },
        include: {
          employerProfile: {
            select: {
              companyName: true,
              logoUrl: true,
              verificationStatus: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!row) return null;

      const isExternal = row.sourceType === 'CURATED_EXTERNAL';
      const companyName = isExternal
        ? (row.externalCompany ?? 'Industry Partner')
        : (row.employerProfile?.companyName ?? 'Verified Employer');
      const companyLogoUrl = isExternal
        ? row.externalLogoUrl
        : (row.employerProfile?.logoUrl ?? null);
      const companyVerificationStatus = isExternal
        ? 'VERIFIED'
        : ((row.employerProfile?.verificationStatus as 'PENDING' | 'VERIFIED' | 'REJECTED') ?? 'VERIFIED');

      return {
        id: row.id,
        employerProfileId: row.employerProfileId,
        sourceType: row.sourceType as ListingSourceType,
        externalUrl: row.externalUrl,
        contactEmail: row.contactEmail,
        externalCompany: row.externalCompany,
        externalLogoUrl: row.externalLogoUrl,
        companyName,
        companyLogoUrl,
        companyVerificationStatus,
        title: row.title,
        description: row.description,
        disciplines: row.disciplines,
        location: row.location,
        isRemote: row.isRemote,
        stipendAmount: row.stipendAmount,
        isStipendNegotiable: row.isStipendNegotiable,
        durationWeeks: row.durationWeeks,
        requirements: row.requirements,
        applicationDeadline: row.applicationDeadline,
        maxApplicants: row.maxApplicants,
        status: row.status as ListingStatus,
        isModerated: row.isModerated,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        applicantCount: row._count?.applications ?? 0,
      };
    } catch (err) {
      console.error(`[PrismaListingRepository] findDetailsById(${id}) error:`, err);
      return null;
    }
  }

  async findByEmployerProfileId(employerProfileId: string): Promise<Listing[]> {
    try {
      const rows = await prisma.listing.findMany({
        where: { employerProfileId },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((r) => this.toDomain(r as unknown as ListingDbRow));
    } catch (err) {
      console.error(`[PrismaListingRepository] findByEmployerProfileId(${employerProfileId}) error:`, err);
      return [];
    }
  }

  async findByEmployer(employerProfileId: string): Promise<EmployerListingItem[]> {
    try {
      const rows = await prisma.listing.findMany({
        where: { employerProfileId },
        include: {
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return rows.map((r) => ({
        listing: this.toDomain(r as unknown as ListingDbRow),
        applicantCount: r._count?.applications ?? 0,
      }));
    } catch (err) {
      console.error(`[PrismaListingRepository] findByEmployer(${employerProfileId}) error:`, err);
      return [];
    }
  }

  async findPublic(filters: ListingFilterInput): Promise<PublicListingsResult> {
    try {
      const page = Number(filters.page) || 1;
      const pageSize = Number(filters.pageSize) || 10;
      const skip = (page - 1) * pageSize;

      const whereClause: {
        status?: 'OPEN' | 'CLOSED';
        isModerated?: boolean;
        sourceType?: 'NATIVE' | 'CURATED_EXTERNAL';
        disciplines?: { has: string };
        location?: { contains: string; mode: 'insensitive' };
        isRemote?: boolean;
        OR?: Array<{
          title?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
          externalCompany?: { contains: string; mode: 'insensitive' };
        }>;
      } = {
        status: 'OPEN',
        isModerated: false,
      };

      if (filters.sourceType && filters.sourceType !== 'ALL') {
        whereClause.sourceType = filters.sourceType as 'NATIVE' | 'CURATED_EXTERNAL';
      }

      if (filters.discipline) {
        whereClause.disciplines = {
          has: filters.discipline,
        };
      }

      if (filters.location) {
        whereClause.location = {
          contains: filters.location,
          mode: 'insensitive',
        };
      }

      if (filters.isRemote !== undefined) {
        whereClause.isRemote = filters.isRemote;
      }

      if (filters.keyword) {
        whereClause.OR = [
          { title: { contains: filters.keyword, mode: 'insensitive' } },
          { description: { contains: filters.keyword, mode: 'insensitive' } },
          { externalCompany: { contains: filters.keyword, mode: 'insensitive' } },
        ];
      }

      const [rows, total] = await Promise.all([
        prisma.listing.findMany({
          where: whereClause,
          include: {
            employerProfile: {
              select: {
                companyName: true,
                logoUrl: true,
                verificationStatus: true,
              },
            },
            _count: {
              select: { applications: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.listing.count({ where: whereClause }),
      ]);

      const listings: ListingWithEmployer[] = rows.map((r) => {
        const isExternal = r.sourceType === 'CURATED_EXTERNAL';
        const companyName = isExternal
          ? (r.externalCompany ?? 'Industry Partner')
          : (r.employerProfile?.companyName ?? 'Verified Employer');
        const companyLogoUrl = isExternal
          ? r.externalLogoUrl
          : (r.employerProfile?.logoUrl ?? null);
        const companyVerificationStatus = isExternal
          ? 'VERIFIED'
          : ((r.employerProfile?.verificationStatus as 'PENDING' | 'VERIFIED' | 'REJECTED') ?? 'VERIFIED');

        return {
          id: r.id,
          employerProfileId: r.employerProfileId,
          sourceType: r.sourceType as ListingSourceType,
          externalUrl: r.externalUrl,
          contactEmail: r.contactEmail,
          externalCompany: r.externalCompany,
          externalLogoUrl: r.externalLogoUrl,
          companyName,
          companyLogoUrl,
          companyVerificationStatus,
          title: r.title,
          description: r.description,
          disciplines: r.disciplines,
          location: r.location,
          isRemote: r.isRemote,
          stipendAmount: r.stipendAmount,
          isStipendNegotiable: r.isStipendNegotiable,
          durationWeeks: r.durationWeeks,
          requirements: r.requirements,
          applicationDeadline: r.applicationDeadline,
          maxApplicants: r.maxApplicants,
          status: r.status as ListingStatus,
          isModerated: r.isModerated,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          applicantCount: r._count?.applications ?? 0,
        };
      });

      return { listings, total };
    } catch (err) {
      console.error('[PrismaListingRepository] findPublic error:', err);
      return { listings: [], total: 0 };
    }
  }

  async create(data: Partial<ListingProps> & { employerProfileId?: string | null; title: string; description: string; disciplines: string[]; location: string }): Promise<Listing> {
    const id = data.id || createId();
    const row = await prisma.listing.create({
      data: {
        id,
        employerProfileId: data.employerProfileId ?? null,
        sourceType: (data.sourceType ?? 'NATIVE') as 'NATIVE' | 'CURATED_EXTERNAL',
        externalUrl: data.externalUrl ?? null,
        contactEmail: data.contactEmail ?? null,
        externalCompany: data.externalCompany ?? null,
        externalLogoUrl: data.externalLogoUrl ?? null,
        title: data.title,
        description: data.description,
        disciplines: data.disciplines,
        location: data.location,
        isRemote: data.isRemote ?? false,
        stipendAmount: data.stipendAmount ?? null,
        isStipendNegotiable: data.isStipendNegotiable ?? false,
        durationWeeks: data.durationWeeks ?? null,
        requirements: data.requirements ?? null,
        applicationDeadline: data.applicationDeadline ?? null,
        maxApplicants: data.maxApplicants ?? null,
        status: data.status || 'OPEN',
        isModerated: data.isModerated ?? false,
      },
    });
    return this.toDomain(row as unknown as ListingDbRow);
  }

  async save(listing: Listing): Promise<Listing> {
    const data = listing.toObject();
    const row = await prisma.listing.create({
      data: {
        id: data.id,
        employerProfileId: data.employerProfileId ?? null,
        sourceType: (data.sourceType ?? 'NATIVE') as 'NATIVE' | 'CURATED_EXTERNAL',
        externalUrl: data.externalUrl ?? null,
        contactEmail: data.contactEmail ?? null,
        externalCompany: data.externalCompany ?? null,
        externalLogoUrl: data.externalLogoUrl ?? null,
        title: data.title,
        description: data.description,
        disciplines: data.disciplines,
        location: data.location,
        isRemote: data.isRemote,
        stipendAmount: data.stipendAmount ?? null,
        isStipendNegotiable: data.isStipendNegotiable ?? false,
        durationWeeks: data.durationWeeks ?? null,
        requirements: data.requirements ?? null,
        applicationDeadline: data.applicationDeadline ?? null,
        maxApplicants: data.maxApplicants ?? null,
        status: data.status,
        isModerated: data.isModerated,
      },
    });
    return this.toDomain(row as unknown as ListingDbRow);
  }

  async update(listing: Listing): Promise<Listing> {
    const data = listing.toObject();
    const row = await prisma.listing.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        disciplines: data.disciplines,
        location: data.location,
        isRemote: data.isRemote,
        stipendAmount: data.stipendAmount ?? null,
        isStipendNegotiable: data.isStipendNegotiable ?? false,
        durationWeeks: data.durationWeeks ?? null,
        requirements: data.requirements ?? null,
        applicationDeadline: data.applicationDeadline ?? null,
        maxApplicants: data.maxApplicants ?? null,
        status: data.status,
        isModerated: data.isModerated,
        sourceType: (data.sourceType ?? 'NATIVE') as 'NATIVE' | 'CURATED_EXTERNAL',
        externalUrl: data.externalUrl ?? null,
        contactEmail: data.contactEmail ?? null,
        externalCompany: data.externalCompany ?? null,
        externalLogoUrl: data.externalLogoUrl ?? null,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(row as unknown as ListingDbRow);
  }

  async toggleStatus(id: string): Promise<Listing> {
    const current = await this.findById(id);
    if (!current) {
      throw new Error(`Listing ${id} not found`);
    }
    const updated = current.toggleStatus();
    return this.update(updated);
  }

  async flagForModeration(id: string): Promise<void> {
    await prisma.listing.update({
      where: { id },
      data: { isModerated: true },
    });
  }

  async findAllForAdmin(filters?: { isModerated?: boolean; status?: 'OPEN' | 'CLOSED'; sourceType?: ListingSourceType }): Promise<ListingWithEmployer[]> {
    try {
      const whereClause: { isModerated?: boolean; status?: 'OPEN' | 'CLOSED'; sourceType?: 'NATIVE' | 'CURATED_EXTERNAL' } = {};
      if (filters?.isModerated !== undefined) {
        whereClause.isModerated = filters.isModerated;
      }
      if (filters?.status) {
        whereClause.status = filters.status;
      }
      if (filters?.sourceType) {
        whereClause.sourceType = filters.sourceType as 'NATIVE' | 'CURATED_EXTERNAL';
      }

      const rows = await prisma.listing.findMany({
        where: whereClause,
        include: {
          employerProfile: {
            select: {
              companyName: true,
              logoUrl: true,
              verificationStatus: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return rows.map((r) => {
        const isExternal = r.sourceType === 'CURATED_EXTERNAL';
        const companyName = isExternal
          ? (r.externalCompany ?? 'Industry Partner')
          : (r.employerProfile?.companyName ?? 'Verified Employer');
        const companyLogoUrl = isExternal
          ? r.externalLogoUrl
          : (r.employerProfile?.logoUrl ?? null);
        const companyVerificationStatus = isExternal
          ? 'VERIFIED'
          : ((r.employerProfile?.verificationStatus as 'PENDING' | 'VERIFIED' | 'REJECTED') ?? 'VERIFIED');

        return {
          id: r.id,
          employerProfileId: r.employerProfileId,
          sourceType: r.sourceType as ListingSourceType,
          externalUrl: r.externalUrl,
          contactEmail: r.contactEmail,
          externalCompany: r.externalCompany,
          externalLogoUrl: r.externalLogoUrl,
          companyName,
          companyLogoUrl,
          companyVerificationStatus,
          title: r.title,
          description: r.description,
          disciplines: r.disciplines,
          location: r.location,
          isRemote: r.isRemote,
          stipendAmount: r.stipendAmount,
          isStipendNegotiable: r.isStipendNegotiable,
          durationWeeks: r.durationWeeks,
          requirements: r.requirements,
          applicationDeadline: r.applicationDeadline,
          maxApplicants: r.maxApplicants,
          status: r.status as ListingStatus,
          isModerated: r.isModerated,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          applicantCount: r._count?.applications ?? 0,
        };
      });
    } catch (err) {
      console.error('[PrismaListingRepository] findAllForAdmin error:', err);
      return [];
    }
  }

  async moderate(id: string, isModerated: boolean): Promise<Listing> {
    const row = await prisma.listing.update({
      where: { id },
      data: { isModerated },
    });
    return this.toDomain(row as unknown as ListingDbRow);
  }

  private toDomain(row: ListingDbRow): Listing {
    return new Listing({
      id: row.id,
      employerProfileId: row.employerProfileId,
      sourceType: row.sourceType as ListingSourceType,
      externalUrl: row.externalUrl,
      contactEmail: row.contactEmail,
      externalCompany: row.externalCompany,
      externalLogoUrl: row.externalLogoUrl,
      title: row.title,
      description: row.description,
      disciplines: row.disciplines,
      location: row.location,
      isRemote: row.isRemote,
      stipendAmount: row.stipendAmount,
      isStipendNegotiable: row.isStipendNegotiable,
      durationWeeks: row.durationWeeks,
      requirements: row.requirements,
      applicationDeadline: row.applicationDeadline,
      maxApplicants: row.maxApplicants,
      status: row.status as ListingStatus,
      isModerated: row.isModerated,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

