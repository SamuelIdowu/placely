// src/domain/ports/IEmployerProfileRepository.ts

import type { EmployerProfile } from '@/domain/entities/employer-profile';
import type { EmployerProfileRepositoryPort } from './employer-profile-repository.port';

export type IEmployerProfileRepository = EmployerProfileRepositoryPort;
export type { EmployerProfileRepositoryPort };

export interface IEmployerProfileRepositoryInterface {
  findById(id: string): Promise<EmployerProfile | null>;
  findByUserId(userId: string): Promise<EmployerProfile | null>;
  save(profile: EmployerProfile): Promise<EmployerProfile>;
  update(profile: EmployerProfile): Promise<EmployerProfile>;
  upsert(profile: EmployerProfile): Promise<EmployerProfile>;
}
