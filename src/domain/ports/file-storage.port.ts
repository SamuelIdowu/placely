// src/domain/ports/file-storage.port.ts
// File storage port (Hexagonal: port = abstract interface).
// Implemented by VercelBlobStorage in infrastructure/storage/.

export interface UploadResult {
  url: string;
}

export interface FileStoragePort {
  upload(file: File, path: string): Promise<UploadResult>;
  delete(url: string): Promise<void>;
}
