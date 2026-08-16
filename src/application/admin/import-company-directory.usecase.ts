// src/application/admin/import-company-directory.usecase.ts
// Use case for admins and IT coordinators to bulk-import approved SIWES companies.

import type { ICompanyDirectoryRepository } from '@/domain/ports/company-directory-repository.port';
import { ValidationError } from '@/lib/errors';

export interface CompanyImportItem {
  name: string;
  industry: string;
  location: string;
  address?: string;
  contactEmail?: string;
  phone?: string;
  websiteUrl?: string;
  isUniversityApproved?: boolean;
  approvedByUniversity?: string;
}

export interface ImportCompanyDirectoryDTO {
  companies: CompanyImportItem[];
  defaultUniversity?: string;
}

export class ImportCompanyDirectoryUseCase {
  constructor(private readonly directoryRepo: ICompanyDirectoryRepository) {}

  async execute(dto: ImportCompanyDirectoryDTO): Promise<{ importedCount: number }> {
    if (!dto.companies || !Array.isArray(dto.companies) || dto.companies.length === 0) {
      throw new ValidationError('A non-empty array of company items is required');
    }

    const validatedItems = dto.companies
      .filter((item) => item.name && item.name.trim().length > 0)
      .map((item) => ({
        name: item.name.trim(),
        industry: item.industry?.trim() || 'General Engineering & Technology',
        location: item.location?.trim() || 'Lagos, Nigeria',
        address: item.address?.trim(),
        contactEmail: item.contactEmail?.trim(),
        phone: item.phone?.trim(),
        websiteUrl: item.websiteUrl?.trim(),
        isUniversityApproved: item.isUniversityApproved ?? (Boolean(dto.defaultUniversity || item.approvedByUniversity)),
        approvedByUniversity: item.approvedByUniversity?.trim() || dto.defaultUniversity || null,
      }));

    const importedCount = await this.directoryRepo.bulkCreate(validatedItems);

    return { importedCount };
  }
}
