// src/application/student/search-company-directory.usecase.ts
// Use case for students searching approved SIWES companies in the directory.

import type { ICompanyDirectoryRepository, CompanyDirectoryFilter } from '@/domain/ports/company-directory-repository.port';
import type { CompanyDirectory } from '@/domain/entities/company-directory.entity';

export interface SearchCompanyDirectoryResult {
  companies: CompanyDirectory[];
  total: number;
}

export class SearchCompanyDirectoryUseCase {
  constructor(private readonly directoryRepo: ICompanyDirectoryRepository) {}

  async execute(filter?: CompanyDirectoryFilter): Promise<SearchCompanyDirectoryResult> {
    return this.directoryRepo.findAll(filter);
  }
}
