// src/application/employer/upload-cac-document.ts

import type { EmployerProfileRepositoryPort } from '@/domain/ports/employer-profile-repository.port';
import type { VerificationRepositoryPort } from '@/domain/ports/verification-repository.port';
import type { FileStoragePort } from '@/domain/ports/file-storage.port';
import { VerificationRequest } from '@/domain/entities/verification-request';

export interface UploadCacDocumentInput {
  userId: string;
  file: File;
}

export interface UploadCacDocumentOutput {
  success: boolean;
  documentUrl?: string;
  error?: string;
}

export class UploadCacDocumentUseCase {
  constructor(
    private readonly employerProfiles: EmployerProfileRepositoryPort,
    private readonly verifications: VerificationRepositoryPort,
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(input: UploadCacDocumentInput): Promise<UploadCacDocumentOutput> {
    const employerProfile = await this.employerProfiles.findByUserId(input.userId);
    if (!employerProfile) {
      return { success: false, error: 'Employer profile not found. Please setup your company profile first.' };
    }

    const path = `uploads/employers/${employerProfile.id}/cac/${Date.now()}-${input.file.name}`;

    try {
      const uploadResult = await this.fileStorage.upload(input.file, path);

      const existingVerification = await this.verifications.findByEmployerProfileId(employerProfile.id);
      const verificationRequest = new VerificationRequest({
        id: existingVerification ? existingVerification.id : crypto.randomUUID(),
        type: 'CAC_DOCUMENT',
        documentUrl: uploadResult.url,
        status: 'PENDING',
        employerProfileId: employerProfile.id,
        createdAt: existingVerification ? existingVerification.toObject().createdAt : new Date(),
        updatedAt: new Date(),
      });

      await this.verifications.upsert(verificationRequest);

      return {
        success: true,
        documentUrl: uploadResult.url,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload CAC document';
      return { success: false, error: message };
    }
  }
}
