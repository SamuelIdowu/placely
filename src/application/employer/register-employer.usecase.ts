// src/application/employer/register-employer.usecase.ts

import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import { EmployerProfile } from '@/domain/entities/employer-profile';
import { createId } from '@paralleldrive/cuid2';

export interface RegisterEmployerInput {
  userId: string;
  companyName: string;
  cacNumber: string;
  description?: string;
  websiteUrl?: string;
}

export interface RegisterEmployerOutput {
  success: boolean;
  profileId?: string;
  error?: string;
}

export class RegisterEmployerUseCase {
  constructor(private readonly employerProfiles: EmployerProfileRepositoryPort) {}

  async execute(input: RegisterEmployerInput): Promise<RegisterEmployerOutput> {
    const existing = await this.employerProfiles.findByUserId(input.userId);
    if (existing) return { success: false, error: 'Employer profile already exists' };

    const now = new Date();
    const profile = new EmployerProfile({
      id: createId(),
      userId: input.userId,
      companyName: input.companyName,
      cacNumber: input.cacNumber,
      description: input.description,
      websiteUrl: input.websiteUrl,
      verificationStatus: 'PENDING',
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.employerProfiles.save(profile);
    return { success: true, profileId: saved.id };
  }
}
