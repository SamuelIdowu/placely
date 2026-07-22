// src/application/student/get-my-applications.usecase.ts

import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import type { Application } from '@/domain/entities/application';

export interface GetMyApplicationsInput {
  studentId: string; // StudentProfile.id
}

export interface GetMyApplicationsOutput {
  applications: ReturnType<Application['toObject']>[];
}

export class GetMyApplicationsUseCase {
  constructor(private readonly applications: ApplicationRepositoryPort) {}

  async execute(input: GetMyApplicationsInput): Promise<GetMyApplicationsOutput> {
    const apps = await this.applications.findByStudentId(input.studentId);
    return { applications: apps.map((a) => a.toObject()) };
  }
}
