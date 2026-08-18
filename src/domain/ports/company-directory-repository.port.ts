// src/domain/ports/company-directory-repository.port.ts
// Port interface for company directory storage operations.

import type { CompanyDirectory, CompanyDirectoryProps } from '@/domain/entities/company-directory.entity';

export interface CompanyDirectoryFilter {
  university?: string;
  industry?: string;
  location?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ICompanyDirectoryRepository {
  create(data: Omit<CompanyDirectoryProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyDirectory>;
  bulkCreate(items: Array<Omit<CompanyDirectoryProps, 'id' | 'createdAt' | 'updatedAt'>>): Promise<number>;
  findById(id: string): Promise<CompanyDirectory | null>;
  findAll(filter?: CompanyDirectoryFilter): Promise<{ companies: CompanyDirectory[]; total: number }>;
  count(): Promise<number>;
}
