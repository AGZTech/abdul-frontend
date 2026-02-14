'use client';

import type React from 'react';
import { useCallback, useState } from 'react';
import { Upload, X, type File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  error?: string;
}

export function FileUpload({
  accept = '*',
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  onChange,
  disabled = false,
  multiple = true
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File size ${fileSizeMB}MB exceeds maximum of ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || disabled) return;

      const fileArray = Array.from(newFiles);
      const currentCount = files.length;

      if (currentCount + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const uploadedFiles: any[] = fileArray.map((file) => {
        const error = validateFile(file);
        return {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          progress: error ? 0 : 100,
          error
        };
      });

      const newFilesList = [...files, ...uploadedFiles];
      setFiles(newFilesList);

      // Call onChange with valid files only
      const validFiles = newFilesList
        .filter((f) => !f.error)
        .map((f) => f.file);
      onChange?.(validFiles);
    },
    [files, maxFiles, maxSize, disabled, onChange]
  );

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    const newFilesList = files.filter((f) => f.id !== id);
    setFiles(newFilesList);
    const validFiles = newFilesList.filter((f) => !f.error).map((f) => f.file);
    onChange?.(validFiles);
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className='w-full space-y-4'>
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <label className='flex cursor-pointer flex-col items-center justify-center p-8'>
          <div className='flex flex-col items-center gap-1'>
            <div
              className={cn(
                'rounded-full p-1 transition-colors',
                isDragActive ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              <Upload
                className={cn(
                  'h-6 w-6 transition-colors',
                  isDragActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
            </div>
            <div className='text-center'>
              <p className='text-foreground font-semibold'>
                {isDragActive
                  ? 'Drop files here'
                  : 'Drag files here or click to select'}
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                {`Max ${maxFiles} file${maxFiles !== 1 ? 's' : ''}, ${formatFileSize(maxSize)} each`}
              </p>
            </div>
          </div>
          <input
            type='file'
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            className='hidden'
          />
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className='space-y-2'>
          <p className='text-foreground text-sm font-medium'>
            {files.filter((f) => !f.error).length} file
            {files.filter((f) => !f.error).length !== 1 ? 's' : ''} selected
          </p>
          <div className='max-h-96 space-y-2 overflow-y-auto'>
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-all',
                  uploadedFile.error
                    ? 'bg-destructive/5 border-destructive/20'
                    : 'bg-card border-border hover:border-primary/50'
                )}
              >
                {/* File Icon */}
                <div className='flex-shrink-0 text-xl'>
                  {getFileIcon(uploadedFile.file)}
                </div>

                {/* File Info */}
                <div className='min-w-0 flex-1'>
                  <p className='text-foreground truncate text-sm font-medium'>
                    {uploadedFile.file.name}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>

                {/* Status */}
                <div className='flex flex-shrink-0 items-center gap-2'>
                  {uploadedFile.error ? (
                    <div className='flex items-center gap-1'>
                      <AlertCircle className='text-destructive h-4 w-4' />
                      <span className='text-destructive max-w-xs text-xs'>
                        {uploadedFile.error}
                      </span>
                    </div>
                  ) : (
                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className='hover:bg-muted flex-shrink-0 rounded p-1 transition-colors'
                  aria-label='Remove file'
                >
                  <X className='text-muted-foreground hover:text-foreground h-4 w-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
