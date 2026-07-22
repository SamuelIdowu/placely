// src/infrastructure/db/student-profile.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import { StudentProfile, type StudentProfileProps, type VerificationStatus } from '@/domain/entities/student-profile';

export class PrismaStudentProfileRepository implements StudentProfileRepositoryPort {
  async findById(id: string): Promise<StudentProfile | null> {
    const row = await prisma.studentProfile.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<StudentProfile | null> {
    const row = await prisma.studentProfile.findUnique({ where: { userId } });
    return row ? this.toDomain(row) : null;
  }

  async save(profile: StudentProfile): Promise<StudentProfile> {
    const data = profile.toObject();
    const row = await prisma.studentProfile.create({
      data: {
        id: data.id,
        userId: data.userId,
        university: data.university,
        discipline: data.discipline,
        cgpa: data.cgpa,
        resumeUrl: data.resumeUrl,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
        bio: data.bio,
        profileCompleteness: data.profileCompleteness,
        verificationStatus: data.verificationStatus,
      },
    });
    return this.toDomain(row);
  }

  async update(profile: StudentProfile): Promise<StudentProfile> {
    const data = profile.toObject();
    const row = await prisma.studentProfile.update({
      where: { id: data.id },
      data: {
        university: data.university,
        discipline: data.discipline,
        cgpa: data.cgpa,
        resumeUrl: data.resumeUrl,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
        bio: data.bio,
        profileCompleteness: data.profileCompleteness,
        verificationStatus: data.verificationStatus,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    userId: string;
    university: string;
    discipline: string;
    cgpa: number | null;
    resumeUrl: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    bio: string | null;
    profileCompleteness: number;
    verificationStatus: string;
    createdAt: Date;
    updatedAt: Date;
  }): StudentProfile {
    return new StudentProfile({
      id: row.id,
      userId: row.userId,
      university: row.university,
      discipline: row.discipline,
      cgpa: row.cgpa ?? undefined,
      resumeUrl: row.resumeUrl ?? undefined,
      linkedinUrl: row.linkedinUrl ?? undefined,
      portfolioUrl: row.portfolioUrl ?? undefined,
      bio: row.bio ?? undefined,
      profileCompleteness: row.profileCompleteness,
      verificationStatus: row.verificationStatus as VerificationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
