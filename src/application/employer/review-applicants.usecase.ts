// src/application/employer/review-applicants.usecase.ts

import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import type { Application } from '@/domain/entities/application';

export interface ReviewApplicantsInput {
  listingId: string;
}

export interface ReviewApplicantsOutput {
  applications: ReturnType<Application['toObject']>[];
}

export class ReviewApplicantsUseCase {
  constructor(private readonly applications: ApplicationRepositoryPort) {}

  async execute(input: ReviewApplicantsInput): Promise<ReviewApplicantsOutput> {
    const apps = this.applications.findByListingId
      ? await this.applications.findByListingId(input.listingId)
      : (await this.applications.findByListing(input.listingId)).map((a) => a.application);
    return { applications: apps.map((a: Application) => a.toObject()) };
  }
}
