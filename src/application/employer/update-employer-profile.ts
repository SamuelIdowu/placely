// src/application/employer/update-employer-profile.ts

import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import { EmployerProfile } from '@/domain/entities/employer-profile';
import { employerProfileSchema, type EmployerProfileInput } from '@/domain/value-objects/profile';

export interface UpdateEmployerProfileInput extends EmployerProfileInput {
  userId: string;
}

export interface UpdateEmployerProfileOutput {
  success: boolean;
  profile?: EmployerProfile;
  error?: string;
}

export class UpdateEmployerProfileUseCase {
  constructor(private readonly employerProfiles: EmployerProfileRepositoryPort) {}

  async execute(input: UpdateEmployerProfileInput): Promise<UpdateEmployerProfileOutput> {
    const parseResult = employerProfileSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message ?? 'Invalid input employer data',
      };
    }

    const existing = await this.employerProfiles.findByUserId(input.userId);

    const profileProps = {
      id: existing ? existing.id : crypto.randomUUID(),
      userId: input.userId,
      companyName: parseResult.data.companyName,
      cacNumber: parseResult.data.cacNumber,
      description: parseResult.data.description ?? existing?.toObject().description,
      logoUrl: parseResult.data.logoUrl ?? existing?.toObject().logoUrl,
      websiteUrl: parseResult.data.websiteUrl ?? existing?.toObject().websiteUrl,
      verificationStatus: existing ? existing.verificationStatus : 'PENDING',
      createdAt: existing ? existing.toObject().createdAt : new Date(),
      updatedAt: new Date(),
    };

    const profileToSave = new EmployerProfile(profileProps);
    const saved = await this.employerProfiles.upsert(profileToSave);

    return {
      success: true,
      profile: saved,
    };
  }
}
