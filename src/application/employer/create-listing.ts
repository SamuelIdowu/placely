// src/application/employer/create-listing.ts

import type { IListingRepository } from '@/domain/ports/IListingRepository';
import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import { createListingSchema, type CreateListingInput } from '@/domain/value-objects/listing';
import { Listing } from '@/domain/entities/listing';
import { createId } from '@paralleldrive/cuid2';

export interface CreateListingCommand extends CreateListingInput {
  employerProfileId: string;
}

export class CreateListingUseCase {
  constructor(
    private readonly listingRepo: IListingRepository,
    private readonly employerRepo: EmployerProfileRepositoryPort
  ) {}

  async execute(input: CreateListingCommand): Promise<Listing> {
    const validatedData = createListingSchema.parse({
      title: input.title,
      description: input.description,
      disciplines: input.disciplines,
      location: input.location,
      isRemote: input.isRemote,
    });

    const employer = await this.employerRepo.findById(input.employerProfileId);
    if (!employer) {
      throw new Error('Employer profile not found');
    }

    if (employer.verificationStatus !== 'VERIFIED') {
      throw new Error('You must be verified before posting a listing');
    }

    const now = new Date();
    const listing = new Listing({
      id: createId(),
      employerProfileId: input.employerProfileId,
      title: validatedData.title,
      description: validatedData.description,
      disciplines: validatedData.disciplines,
      location: validatedData.location,
      isRemote: validatedData.isRemote ?? false,
      status: 'OPEN',
      isModerated: false, // Default unmoderated
      createdAt: now,
      updatedAt: now,
    });

    return this.listingRepo.save(listing);
  }
}
