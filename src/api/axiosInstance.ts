import axios from "axios";
import { API_BASE_URL, API_KEY } from "./constants";

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
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
    if (config.params) {
      console.log('Params:', config.params);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk logging dan error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
      console.error('Error URL:', error.config?.url);
      console.error('Error Method:', error.config?.method);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Add user-friendly error messages based on status codes
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
      console.error('❌ Network Error - No response received:', error.request);
      error.errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      console.error('❌ Request Setup Error:', error.message);
      error.errorMessage = `Error dalam setup request: ${error.message}`;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
