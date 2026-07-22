// src/infrastructure/db/listing.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { ListingRepositoryPort, ListingFilter } from '@/domain/ports/listing-repository.port';
import { Listing, type ListingStatus } from '@/domain/entities/listing';

export class PrismaListingRepository implements ListingRepositoryPort {
  async findById(id: string): Promise<Listing | null> {
    const row = await prisma.listing.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmployerProfileId(employerProfileId: string): Promise<Listing[]> {
    const rows = await prisma.listing.findMany({ where: { employerProfileId } });
    return rows.map((r: any) => this.toDomain(r));
  }

  async findOpen(filter?: ListingFilter): Promise<Listing[]> {
    const rows = await prisma.listing.findMany({
      where: {
        status: 'OPEN',
        isModerated: true,
        ...(filter?.discipline && {
          disciplines: { has: filter.discipline },
        }),
        ...(filter?.location && { location: { contains: filter.location, mode: 'insensitive' } }),
        ...(filter?.isRemote !== undefined && { isRemote: filter.isRemote }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r: any) => this.toDomain(r));
  }

  async save(listing: Listing): Promise<Listing> {
    const data = listing.toObject();
    const row = await prisma.listing.create({
      data: {
        id: data.id,
        employerProfileId: data.employerProfileId,
        title: data.title,
        description: data.description,
        disciplines: data.disciplines,
        location: data.location,
        isRemote: data.isRemote,
        status: data.status,
        isModerated: data.isModerated,
      },
    });
    return this.toDomain(row);
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
        status: data.status,
        isModerated: data.isModerated,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    employerProfileId: string;
    title: string;
    description: string;
    disciplines: string[];
    location: string;
    isRemote: boolean;
    status: string;
    isModerated: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Listing {
    return new Listing({
      id: row.id,
      employerProfileId: row.employerProfileId,
      title: row.title,
      description: row.description,
      disciplines: row.disciplines,
      location: row.location,
      isRemote: row.isRemote,
      status: row.status as ListingStatus,
      isModerated: row.isModerated,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
