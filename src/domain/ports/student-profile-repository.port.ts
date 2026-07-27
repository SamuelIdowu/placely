// src/domain/ports/student-profile-repository.port.ts

import type { StudentProfile } from '@/domain/entities/student-profile';

export interface StudentProfileRepositoryPort {
  findById(id: string): Promise<StudentProfile | null>;
  findByUserId(userId: string): Promise<StudentProfile | null>;
  save(profile: StudentProfile): Promise<StudentProfile>;
  update(profile: StudentProfile): Promise<StudentProfile>;
  upsert(profile: StudentProfile): Promise<StudentProfile>;
}
