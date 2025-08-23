/**
 * Type definitions untuk Storage API
 */

/**
 * Interface untuk file yang diupload
 */
export interface StorageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mime_type: string;
  url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface untuk response upload file
 */
export interface UploadResponse {
  file: StorageFile;
}

/**
 * Interface untuk response daftar file
 */
export interface FileListResponse {
  files: StorageFile[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Interface untuk parameter pencarian file
 */
export interface FileSearchParams {
  page?: number;
  per_page?: number;
  search?: string;
  mime_type?: string;
}

/**
 * Interface untuk parameter upload file
 */
export interface UploadFileParams {
  file: File;
  folder?: string;
  description?: string;
}