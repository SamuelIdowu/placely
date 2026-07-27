// src/infrastructure/storage/vercel-blob.storage.ts
// Vercel Blob implementation of FileStoragePort with MIME type and file size validation.

import { put, del } from '@vercel/blob';
import type { FileStoragePort, UploadResult } from '@/domain/ports/file-storage.port';

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class VercelBlobStorage implements FileStoragePort {
  async upload(file: File, path: string): Promise<UploadResult> {
    if (!file) {
      throw new UploadError('No file provided');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new UploadError('File size exceeds maximum limit of 5MB');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      throw new UploadError('Invalid file type. Only PDF, JPEG, PNG, and WEBP files are allowed.');
    }

    try {
      const blob = await put(path, file, {
        access: 'public',
      });
      return { url: blob.url };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new UploadError(`Upload failed: ${err.message}`);
      }
      throw new UploadError('Upload failed due to an unknown storage error');
    }
  }

  async delete(url: string): Promise<void> {
    try {
      await del(url);
    } catch {
      // Silent failure if file already deleted or not found
    }
  }
}
