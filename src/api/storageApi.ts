import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_KEY, STORAGE_BASE_URL } from "./constants";

// Base URL untuk storage API
const baseURL = STORAGE_BASE_URL;

/**
 * Type untuk response API yang berhasil
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Type untuk error response dari API
 */
export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Instance axios terpusat untuk mengakses Storage API
 */
const storageApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
  httpsAgent: {
    rejectUnauthorized: false,
  },
});

// ... interceptor tetap sama
export default storageApi;
