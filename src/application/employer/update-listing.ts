// src/application/employer/update-listing.ts

import type { IListingRepository } from '@/domain/ports/IListingRepository';
import { updateListingSchema, type UpdateListingInput } from '@/domain/value-objects/listing';
import { Listing } from '@/domain/entities/listing';

export interface UpdateListingCommand extends UpdateListingInput {
  listingId: string;
  employerProfileId: string;
}

export class UpdateListingUseCase {
  constructor(private readonly listingRepo: IListingRepository) {}

  async execute(input: UpdateListingCommand): Promise<Listing> {
    const validatedData = updateListingSchema.parse({
      title: input.title,
      description: input.description,
      disciplines: input.disciplines,
      location: input.location,
      isRemote: input.isRemote,
      stipendAmount: input.stipendAmount,
      isStipendNegotiable: input.isStipendNegotiable,
      durationWeeks: input.durationWeeks,
      requirements: input.requirements,
      applicationDeadline: input.applicationDeadline,
      maxApplicants: input.maxApplicants,
    });

    const existingListing = await this.listingRepo.findById(input.listingId);
    if (!existingListing) {
      throw new Error('Listing not found');
    }

    if (existingListing.employerProfileId !== input.employerProfileId) {
      throw new Error('Unauthorized: You do not own this listing');
    }

    const currentObj = existingListing.toObject();
    const updatedListing = new Listing({
      ...currentObj,
      title: validatedData.title ?? currentObj.title,
      description: validatedData.description ?? currentObj.description,
      disciplines: validatedData.disciplines ?? currentObj.disciplines,
      location: validatedData.location ?? currentObj.location,
      isRemote: validatedData.isRemote ?? currentObj.isRemote,
      stipendAmount: validatedData.stipendAmount ?? currentObj.stipendAmount,
      isStipendNegotiable: validatedData.isStipendNegotiable ?? currentObj.isStipendNegotiable,
      durationWeeks: validatedData.durationWeeks ?? currentObj.durationWeeks,
      requirements: validatedData.requirements ?? currentObj.requirements,
      applicationDeadline: validatedData.applicationDeadline ?? currentObj.applicationDeadline,
      maxApplicants: validatedData.maxApplicants ?? currentObj.maxApplicants,
      updatedAt: new Date(),
    });

    return this.listingRepo.update(updatedListing);
  }
}
