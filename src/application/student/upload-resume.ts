// src/application/student/upload-resume.ts

import type { StudentProfileRepositoryPort } from '@/domain/ports/student-profile-repository.port';
import type { VerificationRepositoryPort } from '@/domain/ports/verification-repository.port';
import type { FileStoragePort } from '@/domain/ports/file-storage.port';
import { StudentProfile } from '@/domain/entities/student-profile';
import { VerificationRequest } from '@/domain/entities/verification-request';

export interface UploadResumeInput {
  userId: string;
  file: File;
  type?: 'RESUME' | 'SCHOOL_ID';
}

export interface UploadResumeOutput {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export class UploadResumeUseCase {
  constructor(
    private readonly studentProfiles: StudentProfileRepositoryPort,
    private readonly verifications: VerificationRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(input: UploadResumeInput): Promise<UploadResumeOutput> {
    const studentProfile = await this.studentProfiles.findByUserId(input.userId);
    if (!studentProfile) {
      return { success: false, error: 'Student profile not found. Please create your profile first.' };
    }

    const uploadType = input.type ?? 'RESUME';
    const folder = uploadType === 'SCHOOL_ID' ? 'school-ids' : 'resumes';
    const path = `uploads/students/${studentProfile.id}/${folder}/${Date.now()}-${input.file.name}`;

    try {
      const uploadResult = await this.fileStorage.upload(input.file, path);

      if (uploadType === 'RESUME') {
        const updatedProfile = new StudentProfile({
          ...studentProfile.toObject(),
          resumeUrl: uploadResult.url,
          updatedAt: new Date(),
        });
        await this.studentProfiles.upsert(updatedProfile);
      }

      if (uploadType === 'SCHOOL_ID' || uploadType === 'RESUME') {
        const existingVerification = await this.verifications.findByStudentProfileId(studentProfile.id);
        const verificationRequest = new VerificationRequest({
          id: existingVerification ? existingVerification.id : crypto.randomUUID(),
          type: 'SCHOOL_ID',
          documentUrl: uploadResult.url,
          status: 'PENDING',
          studentProfileId: studentProfile.id,
          createdAt: existingVerification ? existingVerification.toObject().createdAt : new Date(),
          updatedAt: new Date(),
        });

        await this.verifications.upsert(verificationRequest);
      }

      return {
        success: true,
        fileUrl: uploadResult.url,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      return { success: false, error: message };
    }
  }
}
