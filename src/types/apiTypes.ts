// src/types/apiTypes.ts
import { AxiosError } from 'axios';
import { Product, Bundling, Category, Brand, SubCategory } from './type';

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

/**
 * API Metadata for pagination
 */
export interface ApiMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  min_price?: number;
  max_price?: number;
}

/**
 * API Error Response
 */
export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status_code?: number;
}

/**
 * Enhanced Axios Error with custom error message
 */
export interface EnhancedAxiosError extends AxiosError<ApiError> {
  errorMessage?: string;
}

/**
 * Product Photo Validation
 */
export interface ValidatedProductPhoto {
  id: number;
  photo: string;
  isValid: boolean;
  fullUrl?: string;
  errorReason?: string;
}

/**
 * Product with validated photos
 */
export interface ValidatedProduct extends Omit<Product, 'productPhotos'> {
  productPhotos: ValidatedProductPhoto[];
  hasValidPhotos: boolean;
  validPhotoCount: number;
}

/**
 * Availability Response
 */
export interface AvailabilityResponse {
  available: boolean;
  available_quantity: number;
  total_quantity: number;
  conflicting_transactions?: AvailabilityTransaction[];
  message?: string;
  is_available?: boolean;
}

/**
 * Availability Transaction
 */
export interface AvailabilityTransaction {
  id: number;
  booking_transaction_id: string;
  start_date: string;
  end_date: string;
  booking_status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  details: AvailabilityTransactionDetail[];
}

/**
 * Availability Transaction Detail
 */
export interface AvailabilityTransactionDetail {
  id: number;
  product_id?: number;
  bundling_id?: number;
  quantity: number;
}

/**
 * API Request Status
 */
export type ApiRequestStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled';

/**
 * API Request State
 */
export interface ApiRequestState<T = any> {
  status: ApiRequestStatus;
  data: T | null;
  error: string | null;
  lastFetched: Date | null;
  cancelReason?: string;
}

/**
 * Product List Response
 */
export interface ProductListResponse extends ApiResponse<Product[]> {
  meta: ApiMeta;
}

/**
 * Bundling List Response
 */
export interface BundlingListResponse extends ApiResponse<Bundling[]> {
  meta: ApiMeta;
}

/**
 * Single Product Response
 */
export interface ProductDetailResponse extends ApiResponse<Product> {}

/**
 * Single Bundling Response
 */
export interface BundlingDetailResponse extends ApiResponse<Bundling> {}

/**
 * Categories List Response
 */
export interface CategoriesListResponse extends ApiResponse<Category[]> {}

/**
 * Brands List Response
 */
export interface BrandsListResponse extends ApiResponse<Brand[]> {}

/**
 * SubCategories List Response
 */
export interface SubCategoriesListResponse extends ApiResponse<SubCategory[]> {}

/**
 * Request cancellation info
 */
export interface RequestCancellationInfo {
  reason: string;
  timestamp: string;
  url?: string;
  method?: string;
}

/**
 * Debug log entry for API requests
 */
export interface ApiDebugLog {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'cancellation';
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  data?: any;
  error?: string;
  cancelInfo?: RequestCancellationInfo;
}

/**
 * Product validation result
 */
export interface ProductValidationResult {
  isValid: boolean;
  hasValidPhotos: boolean;
  validPhotoCount: number;
  invalidPhotoCount: number;
  errors: string[];
  warnings: string[];
}

/**
 * API Cache State
 */
export interface ApiCacheState<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: string;
}

/**
 * Request retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  retryCondition?: (error: EnhancedAxiosError) => boolean;
}

/**
 * Data integrity check result
 */
export interface DataIntegrityResult {
  isValid: boolean;
  missingFields: string[];
  invalidFields: string[];
  warnings: string[];
  severity: 'low' | 'medium' | 'high';
}

/**
 * Type guards for API responses
 */
export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response.success === 'boolean' && 'data' in response;
};

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.success === 'boolean' && error.success === false;
};

export const isEnhancedAxiosError = (error: any): error is EnhancedAxiosError => {
  return error && error.isAxiosError === true;
};

export const isAvailabilityResponse = (response: any): response is AvailabilityResponse => {
  return response && typeof response.available === 'boolean' && 'available_quantity' in response;
};

/**
 * Utility types for API endpoints
 */
export type ProductsEndpoint = '/products';
export type BundlingsEndpoint = '/bundlings';
export type CategoriesEndpoint = '/categories';
export type BrandsEndpoint = '/brands';
export type SubCategoriesEndpoint = '/sub-categories';
export type ProductDetailEndpoint = `/product/${string}`;
export type BundlingDetailEndpoint = `/bundling/${string}`;

export type ApiEndpoint = 
  | ProductsEndpoint 
  | BundlingsEndpoint 
  | CategoriesEndpoint 
  | BrandsEndpoint 
  | SubCategoriesEndpoint 
  | ProductDetailEndpoint 
  | BundlingDetailEndpoint;
