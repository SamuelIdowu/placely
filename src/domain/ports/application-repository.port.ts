// src/domain/ports/application-repository.port.ts

import type { Application, ApplicationStatus } from '@/domain/entities/application';

export interface ApplicationRepositoryPort {
  findById(id: string): Promise<Application | null>;
  findByStudentId(studentId: string): Promise<Application[]>;
  findByListingId(listingId: string): Promise<Application[]>;
  findByListingAndStudent(listingId: string, studentId: string): Promise<Application | null>;
  save(application: Application): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<Application>;
}
