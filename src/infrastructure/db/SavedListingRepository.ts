// src/infrastructure/db/SavedListingRepository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { ISavedListingRepository } from '@/domain/ports/ISavedListingRepository';
import { SavedListing } from '@/domain/entities/saved-listing';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';
import { createId } from '@paralleldrive/cuid2';

export class PrismaSavedListingRepository implements ISavedListingRepository {
  async save(studentProfileId: string, listingId: string): Promise<SavedListing> {
    const row = await prisma.savedListing.upsert({
      where: {
        studentProfileId_listingId: {
          studentProfileId,
          listingId,
        },
      },
      create: {
        id: createId(),
        studentProfileId,
        listingId,
      },
      update: {},
    });

    return new SavedListing({
      id: row.id,
      studentProfileId: row.studentProfileId,
      listingId: row.listingId,
      createdAt: row.createdAt,
    });
  }

  async remove(studentProfileId: string, listingId: string): Promise<void> {
    try {
      await prisma.savedListing.deleteMany({
        where: {
          studentProfileId,
          listingId,
        },
      });
    } catch (err) {
      console.error('[PrismaSavedListingRepository] remove error:', err);
    }
  }

  async isSaved(studentProfileId: string, listingId: string): Promise<boolean> {
    try {
      const count = await prisma.savedListing.count({
        where: {
          studentProfileId,
          listingId,
        },
      });
      return count > 0;
    } catch (err) {
      console.error('[PrismaSavedListingRepository] isSaved error:', err);
      return false;
    }
  }

  async findSavedListingIds(studentProfileId: string): Promise<string[]> {
    try {
      const rows = await prisma.savedListing.findMany({
        where: { studentProfileId },
        select: { listingId: true },
      });
      return rows.map((r) => r.listingId);
    } catch (err) {
      console.error('[PrismaSavedListingRepository] findSavedListingIds error:', err);
      return [];
    }
  }

  async findSavedByStudent(studentProfileId: string): Promise<ListingWithEmployer[]> {
    try {
      const rows = await prisma.savedListing.findMany({
        where: { studentProfileId },
        include: {
          listing: {
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
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return rows.map((r: any) => ({
        id: r.listing.id,
        employerProfileId: r.listing.employerProfileId,
        companyName: r.listing.employerProfile?.companyName ?? 'Verified Employer',
        companyLogoUrl: r.listing.employerProfile?.logoUrl ?? null,
        companyVerificationStatus:
          (r.listing.employerProfile?.verificationStatus as 'PENDING' | 'VERIFIED' | 'REJECTED') ?? 'VERIFIED',
        title: r.listing.title,
        description: r.listing.description,
        disciplines: r.listing.disciplines,
        location: r.listing.location,
        isRemote: r.listing.isRemote,
        status: r.listing.status as 'OPEN' | 'CLOSED',
        isModerated: r.listing.isModerated,
        createdAt: r.listing.createdAt,
        updatedAt: r.listing.updatedAt,
        applicantCount: r.listing._count?.applications ?? 0,
      }));
    } catch (err) {
      console.error('[PrismaSavedListingRepository] findSavedByStudent error:', err);
      return [];
    }
  }
}
