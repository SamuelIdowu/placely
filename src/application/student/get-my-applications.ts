// src/application/student/get-my-applications.ts
// Use Case: Retrieve student's applications with listing and employer details.

import type { IApplicationRepository, ApplicationWithDetails } from '@/domain/ports/IApplicationRepository';

export class GetMyApplicationsUseCase {
  constructor(private readonly applicationRepo: IApplicationRepository) {}

  async execute(studentProfileId: string): Promise<ApplicationWithDetails[]> {
    return this.applicationRepo.findByStudent(studentProfileId);
  }
}
