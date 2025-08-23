import storageApi, { ApiResponse } from "./storageApi";
import { FileListResponse, FileSearchParams, StorageFile, UploadFileParams, UploadResponse } from "../types/storageTypes";

/**
 * Service untuk mengakses Storage API
 */
const StorageService = {
  /**
   * Mengupload file ke storage
   * 
   * @param params - Parameter upload file
   * @returns Promise dengan response upload file
   * 
   * @example
   * ```typescript
   * // Upload file gambar
   * const fileInput = document.getElementById('fileInput') as HTMLInputElement;
   * const file = fileInput.files?.[0];
   * 
   * if (file) {
   *   try {
   *     const response = await StorageService.uploadFile({
   *       file,
   *       folder: 'images',
   *       description: 'Gambar produk'
   *     });
   *     console.log('File berhasil diupload:', response.file.url);
   *   } catch (error) {
   *     console.error('Gagal mengupload file:', error);
   *   }
   * }
   * ```
   */
  uploadFile: async (params: UploadFileParams): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', params.file);
    
    if (params.folder) {
      formData.append('folder', params.folder);
    }
    
    if (params.description) {
      formData.append('description', params.description);
    }
    
    const response = await storageApi.post<ApiResponse<UploadResponse>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  /**
   * Mendapatkan daftar file dari storage
   * 
   * @param params - Parameter pencarian file (opsional)
   * @returns Promise dengan response daftar file
   * 
   * @example
   * ```typescript
   * // Mendapatkan daftar file gambar
   * try {
   *   const response = await StorageService.getFiles({
   *     page: 1,
   *     per_page: 10,
   *     mime_type: 'image',
   *   });
   *   console.log('Daftar file:', response.data.files);
   * } catch (error) {
   *   console.error('Gagal mendapatkan daftar file:', error);
   * }
   * ```
   */
  getFiles: async (params?: FileSearchParams): Promise<ApiResponse<FileListResponse>> => {
    const response = await storageApi.get<ApiResponse<FileListResponse>>('/files', { params });
    return response.data;
  },
  
  /**
   * Mendapatkan detail file berdasarkan ID
   * 
   * @param fileId - ID file yang akan diambil
   * @returns Promise dengan response detail file
   * 
   * @example
   * ```typescript
   * // Mendapatkan detail file
   * try {
   *   const fileId = '123456';
   *   const response = await StorageService.getFileById(fileId);
   *   console.log('Detail file:', response.data.file);
   * } catch (error) {
   *   console.error('Gagal mendapatkan detail file:', error);
   * }
   * ```
   */
  getFileById: async (fileId: string): Promise<ApiResponse<{ file: StorageFile }>> => {
    const response = await storageApi.get<ApiResponse<{ file: StorageFile }>>(`/files/${fileId}`);
    return response.data;
  },
  
  /**
   * Menghapus file berdasarkan ID
   * 
   * @param fileId - ID file yang akan dihapus
   * @returns Promise dengan response status penghapusan
   * 
   * @example
   * ```typescript
   * // Menghapus file
   * try {
   *   const fileId = '123456';
   *   const response = await StorageService.deleteFile(fileId);
   *   console.log('File berhasil dihapus:', response.message);
   * } catch (error) {
   *   console.error('Gagal menghapus file:', error);
   * }
   * ```
   */
  deleteFile: async (fileId: string): Promise<ApiResponse<null>> => {
    const response = await storageApi.delete<ApiResponse<null>>(`/files/${fileId}`);
    return response.data;
  },
};

export default StorageService;