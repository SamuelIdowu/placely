// src/domain/ports/employer-profile-repository.port.ts

import type { EmployerProfile } from '@/domain/entities/employer-profile';

export interface EmployerProfileRepositoryPort {
  findById(id: string): Promise<EmployerProfile | null>;
  findByUserId(userId: string): Promise<EmployerProfile | null>;
  save(profile: EmployerProfile): Promise<EmployerProfile>;
  update(profile: EmployerProfile): Promise<EmployerProfile>;
}
