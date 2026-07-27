// src/infrastructure/storage/upload.ts
// Wrapper around @vercel/blob put() with MIME and size validation.

import { VercelBlobStorage, UploadError } from './vercel-blob.storage';

export { UploadError };

const blobStorage = new VercelBlobStorage();

export async function upload(file: File, folderName = 'uploads'): Promise<string> {
  const filename = `${folderName}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const result = await blobStorage.upload(file, filename);
  return result.url;
}
