import StorageService from "./storageService";
import { handleApiError, formatValidationErrors } from "./errorHandler";

/**
 * Contoh penggunaan Storage API
 * 
 * File ini berisi contoh-contoh penggunaan Storage API
 * yang dapat digunakan sebagai referensi.
 */

/**
 * Contoh fungsi untuk mengupload file
 * 
 * @param file - File yang akan diupload
 * @returns URL file yang berhasil diupload atau null jika gagal
 */
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    // Upload file ke folder 'products'
    const response = await StorageService.uploadFile({
      file,
      folder: 'products',
      description: 'Gambar produk',
    });
    
    // Kembalikan URL file
    return response.data.file.url;
  } catch (error) {
    // Tangani error
    const { message, details } = handleApiError(error);
    
    // Tampilkan pesan error
    console.error('Gagal mengupload gambar produk:', message);
    
    // Jika ada detail validasi, format dan tampilkan
    if (details && typeof details !== 'string') {
      console.error('Detail error:', formatValidationErrors(details));
    }
    
    return null;
  }
};

/**
 * Contoh fungsi untuk mendapatkan daftar file gambar
 * 
 * @param page - Nomor halaman
 * @param perPage - Jumlah item per halaman
 * @returns Array file gambar atau array kosong jika gagal
 */
export const getProductImages = async (
  page: number = 1,
  perPage: number = 10
): Promise<Array<{ id: string; name: string; url: string }>> => {
  try {
    // Dapatkan daftar file gambar
    const response = await StorageService.getFiles({
      page,
      per_page: perPage,
      mime_type: 'image',
    });
    
    // Map response ke format yang lebih sederhana
    return response.data.files.map(file => ({
      id: file.id,
      name: file.name,
      url: file.url,
    }));
  } catch (error) {
    // Tangani error
    const { message } = handleApiError(error);
    console.error('Gagal mendapatkan daftar gambar produk:', message);
    
    return [];
  }
};

/**
 * Contoh fungsi untuk menghapus file
 * 
 * @param fileId - ID file yang akan dihapus
 * @returns true jika berhasil, false jika gagal
 */
export const deleteProductImage = async (fileId: string): Promise<boolean> => {
  try {
    // Hapus file
    await StorageService.deleteFile(fileId);
    return true;
  } catch (error) {
    // Tangani error
    const { message } = handleApiError(error);
    console.error('Gagal menghapus gambar produk:', message);
    
    return false;
  }
};