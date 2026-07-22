// src/infrastructure/storage/vercel-blob.storage.ts
// Vercel Blob implementation of FileStoragePort (ADR-04).
// Domain never imports this — injected via container.ts.

import { put, del } from '@vercel/blob';
import type { FileStoragePort, UploadResult } from '@/domain/ports/file-storage.port';

export class VercelBlobStorage implements FileStoragePort {
  async upload(file: File, path: string): Promise<UploadResult> {
    const blob = await put(path, file, {
      access: 'public',
      // Token from BLOB_READ_WRITE_TOKEN env var (read automatically by @vercel/blob)
    });
    return { url: blob.url };
  }

  async delete(url: string): Promise<void> {
    await del(url);
  }
}
