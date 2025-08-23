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
