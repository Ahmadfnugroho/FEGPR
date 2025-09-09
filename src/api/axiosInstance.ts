import axios from "axios";
import { API_BASE_URL, API_KEY } from "./constants";
import debugLogger from "../utils/debugLogger";
import { isAbortError } from "../types/axiosTypes";

// Instance axios terpusat untuk API utama
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor untuk logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Store request start time for duration calculation
    (config as any).__startTime = Date.now();
    
    // Enhanced debug logging
    const requestId = debugLogger.logRequest(
      config.method || 'unknown',
      `${config.baseURL}${config.url}`,
      {
        headers: config.headers,
        params: config.params,
        data: config.data
      }
    );
    
    // Store request ID for response logging
    (config as any).__requestId = requestId;
    
    return config;
  },
  (error) => {
    debugLogger.logError('unknown', 'unknown', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk logging dan error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = (response.config as any).__startTime 
      ? Date.now() - (response.config as any).__startTime 
      : undefined;
    
    // Enhanced debug logging
    debugLogger.logResponse(
      (response.config as any).__requestId || '',
      response.status,
      response.data,
      duration
    );
    
    return response;
  },
  (error: any) => {
    // Calculate request duration if available
    const duration = (error.config as any)?.__startTime 
      ? Date.now() - (error.config as any).__startTime 
      : undefined;
    
    // Get safe URL and method for logging
    const getErrorUrl = () => {
      const config = error.config;
      if (!config) return 'unknown';
      const baseURL = config.baseURL || '';
      const url = config.url || '';
      if (url.startsWith('http')) return url;
      return `${baseURL}${url}`.replace(/\/+/g, '/').replace(/:\//g, '://');
    };
    
    const getErrorMethod = () => error.config?.method?.toUpperCase() || 'UNKNOWN';
    
    const errorUrl = getErrorUrl();
    const errorMethod = getErrorMethod();
    
    // Handle cancellation errors (both legacy axios.isCancel and modern AbortController)
    if (axios.isCancel(error) || isAbortError(error)) {
      // Use existing debugLogger.logCancellation for consistency
      debugLogger.logCancellation(
        errorMethod,
        errorUrl,
        error.message || 'Request canceled'
      );
      
      // Clean "Request canceled" log for cancelled requests
      console.log('🚫 Request canceled:', { method: errorMethod, url: errorUrl });
      return Promise.reject(error);
    }

    // Handle all other errors with enhanced logging
    debugLogger.logError(errorMethod, errorUrl, error, duration);
    
    // Add user-friendly error messages based on error type
    if (error.response) {
      // Response errors (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          error.errorMessage = 'Tidak memiliki akses. Silakan periksa API key Anda.';
          break;
        case 403:
          error.errorMessage = 'Akses ditolak untuk endpoint ini.';
          break;
        case 404:
          error.errorMessage = 'Endpoint tidak ditemukan.';
          break;
        case 422:
          error.errorMessage = 'Data yang dikirim tidak valid.';
          break;
        case 500:
          error.errorMessage = 'Terjadi kesalahan internal server. Silakan coba lagi nanti.';
          break;
        case 502:
        case 503:
        case 504:
          error.errorMessage = 'Server sedang bermasalah. Silakan coba lagi nanti.';
          break;
        default:
          error.errorMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // Network errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        error.errorMessage = 'Permintaan timeout. Silakan coba lagi.';
      } else {
        error.errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
    } else {
      // Setup errors
      error.errorMessage = `Error dalam setup request: ${error.message}`;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
