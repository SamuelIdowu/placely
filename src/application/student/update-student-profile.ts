// src/application/student/update-student-profile.ts

import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import { StudentProfile, computeCompleteness } from '@/domain/entities/student-profile';
import { studentProfileSchema, type StudentProfileInput } from '@/domain/value-objects/profile';

export interface UpdateStudentProfileInput extends StudentProfileInput {
  userId: string;
}

export interface UpdateStudentProfileOutput {
  success: boolean;
  profile?: StudentProfile;
  error?: string;
}

export class UpdateStudentProfileUseCase {
  constructor(private readonly studentProfiles: StudentProfileRepositoryPort) {}

  async execute(input: UpdateStudentProfileInput): Promise<UpdateStudentProfileOutput> {
    const parseResult = studentProfileSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error.issues[0]?.message ?? 'Invalid input profile data',
      };
    }

    const existing = await this.studentProfiles.findByUserId(input.userId);

    const profileProps = {
      id: existing ? existing.id : crypto.randomUUID(),
      userId: input.userId,
      university: parseResult.data.university,
      discipline: parseResult.data.discipline,
      cgpa: parseResult.data.cgpa,
      resumeUrl: parseResult.data.resumeUrl ?? existing?.toObject().resumeUrl,
      linkedinUrl: parseResult.data.linkedinUrl ?? existing?.toObject().linkedinUrl,
      portfolioUrl: parseResult.data.portfolioUrl ?? existing?.toObject().portfolioUrl,
      bio: parseResult.data.bio ?? existing?.toObject().bio,
      verificationStatus: existing ? existing.verificationStatus : 'PENDING',
      createdAt: existing ? existing.toObject().createdAt : new Date(),
      updatedAt: new Date(),
    };

    const completeness = computeCompleteness(profileProps);
    const profileToSave = new StudentProfile({
      ...profileProps,
      profileCompleteness: completeness,
    });

    const saved = await this.studentProfiles.upsert(profileToSave);

    return {
      success: true,
      profile: saved,
    };
  }
}
