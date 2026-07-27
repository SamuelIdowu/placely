'use client';

import * as React from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropzoneProps {
  label?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  existingUrl?: string;
  onUpload: (file: File) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
}

export function Dropzone({
  label = 'Upload Document',
  description = 'Drag & drop file here or click to browse (PDF, PNG, JPG up to 5MB)',
  accept = '.pdf,.png,.jpg,.jpeg,.webp',
  maxSizeMB = 5,
  existingUrl,
  onUpload,
  disabled = false,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploadSuccess(false);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      await onUpload(file);
      setUploadSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload file';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadSuccess(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <label className="text-sm font-medium text-foreground block">{label}</label>}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[6px] transition-colors cursor-pointer text-center bg-card',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-60 cursor-not-allowed hover:border-muted-foreground/25',
          error && 'border-destructive bg-destructive/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled || isUploading}
          onChange={onChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">Uploading file...</p>
          </div>
        ) : selectedFile || existingUrl ? (
          <div className="flex flex-col items-center justify-center space-y-2 w-full">
            <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md max-w-full">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {selectedFile ? selectedFile.name : existingUrl?.split('/').pop() ?? 'Uploaded File'}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1 hover:bg-muted-foreground/10 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {uploadSuccess && (
              <div className="flex items-center text-emerald-600 text-xs font-medium space-x-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Uploaded successfully</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-muted rounded-full">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">{description}</p>
            <span className="text-xs text-muted-foreground">Click to browse or drag and drop</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-xs text-destructive mt-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
