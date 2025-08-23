import { AxiosError } from "axios";
import { ApiError } from "./storageApi";

/**
 * Tipe untuk fungsi handler error
 */
type ErrorHandler = (error: unknown) => {
  message: string;
  details?: string | Record<string, string[]>;
  statusCode?: number;
};

/**
 * Fungsi untuk menangani error dari API
 * 
 * @param error - Error yang ditangkap dari try-catch
 * @returns Object dengan pesan error yang sudah diformat
 * 
 * @example
 * ```typescript
 * try {
 *   await StorageService.uploadFile({ file });
 * } catch (error) {
 *   const { message, details } = handleApiError(error);
 *   console.error(message);
 *   // Tampilkan pesan error ke user
 * }
 * ```
 */
export const handleApiError: ErrorHandler = (error) => {
  // Default error message
  let message = "Terjadi kesalahan pada sistem";
  let details: string | Record<string, string[]> | undefined;
  let statusCode: number | undefined;
  
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Gunakan custom error message jika ada
    if ((axiosError as any).errorMessage) {
      message = (axiosError as any).errorMessage;
    } else if (axiosError.response?.data?.message) {
      message = axiosError.response.data.message;
    }
    
    // Ambil status code jika ada
    if (axiosError.response?.status) {
      statusCode = axiosError.response.status;
    }
    
    // Ambil detail error jika ada
    if (axiosError.response?.data?.errors) {
      details = axiosError.response.data.errors;
    }
    
    // Log error untuk debugging
    console.error("API Error:", {
      status: statusCode,
      message,
      details,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
    });
  } else if (error instanceof Error) {
    // Error JavaScript biasa
    message = error.message;
    console.error("JavaScript Error:", error);
  } else {
    // Unknown error
    console.error("Unknown Error:", error);
  }
  
  return { message, details, statusCode };
};

/**
 * Fungsi untuk menangani error validasi dari API
 * 
 * @param errors - Object errors dari response API
 * @returns Pesan error yang sudah diformat
 */
export const formatValidationErrors = (errors?: Record<string, string[]>): string => {
  if (!errors) return "";
  
  return Object.entries(errors)
    .map(([field, messages]) => {
      return `${field}: ${messages.join(', ')}`;
    })
    .join('\n');
};