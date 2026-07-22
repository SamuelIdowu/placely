// src/application/student/register-student.usecase.ts

import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { StudentProfile, computeCompleteness } from '@/domain/entities/student-profile';
import { createId } from '@paralleldrive/cuid2';

export interface RegisterStudentInput {
  userId: string;
  university: string;
  discipline: string;
  cgpa?: number;
  bio?: string;
}

export interface RegisterStudentOutput {
  success: boolean;
  profileId?: string;
  error?: string;
}

export class RegisterStudentUseCase {
  constructor(
    private readonly studentProfiles: StudentProfileRepositoryPort,
    private readonly email: EmailServicePort,
  ) {}

  async execute(input: RegisterStudentInput): Promise<RegisterStudentOutput> {
    const existing = await this.studentProfiles.findByUserId(input.userId);
    if (existing) return { success: false, error: 'Student profile already exists' };

    const now = new Date();
    const props = {
      id: createId(),
      userId: input.userId,
      university: input.university,
      discipline: input.discipline,
      cgpa: input.cgpa,
      bio: input.bio,
      verificationStatus: 'PENDING' as const,
      profileCompleteness: 0,
      createdAt: now,
      updatedAt: now,
    };

    const completeness = computeCompleteness(props);
    const profile = new StudentProfile({ ...props, profileCompleteness: completeness });
    const saved = await this.studentProfiles.save(profile);

    return { success: true, profileId: saved.id };
  }
}
