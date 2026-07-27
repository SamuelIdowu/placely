// src/domain/ports/IStudentProfileRepository.ts

import type { StudentProfile } from '@/domain/entities/student-profile';
import type { StudentProfileRepositoryPort } from './student-profile-repository.port';

export type IStudentProfileRepository = StudentProfileRepositoryPort;
export type { StudentProfileRepositoryPort };

export interface IStudentProfileRepositoryInterface {
  findById(id: string): Promise<StudentProfile | null>;
  findByUserId(userId: string): Promise<StudentProfile | null>;
  save(profile: StudentProfile): Promise<StudentProfile>;
  update(profile: StudentProfile): Promise<StudentProfile>;
  upsert(profile: StudentProfile): Promise<StudentProfile>;
}
