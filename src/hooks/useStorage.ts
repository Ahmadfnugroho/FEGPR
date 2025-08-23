import { useState } from 'react';
import StorageService from '../api/storageService';
import { handleApiError } from '../api/errorHandler';
import { StorageFile } from '../types/storageTypes';

/**
 * Hook untuk menggunakan Storage API dalam komponen React
 * 
 * @returns Object dengan fungsi dan state untuk menggunakan Storage API
 * 
 * @example
 * ```tsx
 * const { uploadFile, isUploading, fileList, fetchFiles, deleteFile } = useStorage();
 * 
 * // Upload file
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const fileUrl = await uploadFile(file, 'products');
 *     if (fileUrl) {
 *       console.log('File berhasil diupload:', fileUrl);
 *     }
 *   }
 * };
 * 
 * // Ambil daftar file saat komponen dimount
 * useEffect(() => {
 *   fetchFiles();
 * }, []);
 * ```
 */
export const useStorage = () => {
  // State untuk loading state
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State untuk error
  const [error, setError] = useState<string | null>(null);
  
  // State untuk daftar file
  const [fileList, setFileList] = useState<StorageFile[]>([]);
  
  // State untuk pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });
  
  /**
   * Fungsi untuk mengupload file
   * 
   * @param file - File yang akan diupload
   * @param folder - Folder tujuan (opsional)
   * @param description - Deskripsi file (opsional)
   * @returns URL file yang berhasil diupload atau null jika gagal
   */
  const uploadFile = async (
    file: File,
    folder?: string,
    description?: string
  ): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await StorageService.uploadFile({
        file,
        folder,
        description,
      });
      
      // Refresh file list setelah upload berhasil
      fetchFiles();
      
      return response.data.file.url;
    } catch (err) {
      const { message } = handleApiError(err);
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Fungsi untuk mengambil daftar file
   * 
   * @param page - Nomor halaman (opsional)
   * @param perPage - Jumlah item per halaman (opsional)
   * @param mimeType - Filter berdasarkan tipe MIME (opsional)
   * @param search - Kata kunci pencarian (opsional)
   */
  const fetchFiles = async (
    page: number = 1,
    perPage: number = 10,
    mimeType?: string,
    search?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await StorageService.getFiles({
        page,
        per_page: perPage,
        mime_type: mimeType,
        search,
      });
      
      setFileList(response.data.files);
      setPagination({
        currentPage: response.data.pagination.current_page,
        lastPage: response.data.pagination.last_page,
        perPage: response.data.pagination.per_page,
        total: response.data.pagination.total,
      });
    } catch (err) {
      const { message } = handleApiError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fungsi untuk menghapus file
   * 
   * @param fileId - ID file yang akan dihapus
   * @returns true jika berhasil, false jika gagal
   */
  const deleteFile = async (fileId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await StorageService.deleteFile(fileId);
      
      // Update file list setelah hapus berhasil
      setFileList(prevFiles => prevFiles.filter(file => file.id !== fileId));
      
      return true;
    } catch (err) {
      const { message } = handleApiError(err);
      setError(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  /**
   * Fungsi untuk mendapatkan detail file
   * 
   * @param fileId - ID file
   * @returns File jika berhasil, null jika gagal
   */
  const getFileDetail = async (fileId: string): Promise<StorageFile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await StorageService.getFileById(fileId);
      return response.data.file;
    } catch (err) {
      const { message } = handleApiError(err);
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // State
    isUploading,
    isLoading,
    isDeleting,
    error,
    fileList,
    pagination,
    
    // Functions
    uploadFile,
    fetchFiles,
    deleteFile,
    getFileDetail,
    
    // Helper
    clearError: () => setError(null),
  };
};

export default useStorage;