// src/api/enhancedAxios.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { EnhancedAxiosRequestConfig, EnhancedAxiosError } from '../types/axiosTypes';
import { createManagedAbortController } from '../utils/requestCancellation';

/**
 * Enhanced axios request options with built-in AbortController support
 */
export interface EnhancedRequestOptions extends AxiosRequestConfig {
  /**
   * Auto-generate AbortController for this request
   * If true, creates a managed AbortController automatically
   */
  autoAbort?: boolean;
  
  /**
   * Custom request ID for tracking and cancellation
   */
  requestId?: string;
  
  /**
   * Custom AbortController signal
   * If provided, autoAbort is ignored
   */
  signal?: AbortSignal;
}

/**
 * Enhanced GET request with automatic AbortController support
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const response = await enhancedGet('/products');
 * 
 * // With auto AbortController
 * const response = await enhancedGet('/products', { autoAbort: true });
 * 
 * // With custom AbortController
 * const abortController = new AbortController();
 * const response = await enhancedGet('/products', { signal: abortController.signal });
 * ```
 */
export const enhancedGet = <T = any>(
  url: string, 
  options: EnhancedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, signal, ...axiosOptions } = options;
  
  // Create AbortController if requested and no signal provided
  if (autoAbort && !signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosOptions as any).signal = abortController.signal;
  } else if (signal) {
    (axiosOptions as any).signal = signal;
  }
  
  return axiosInstance.get<T>(url, axiosOptions);
};

/**
 * Enhanced POST request with automatic AbortController support
 */
export const enhancedPost = <T = any>(
  url: string,
  data?: any,
  options: EnhancedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, signal, ...axiosOptions } = options;
  
  if (autoAbort && !signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosOptions as any).signal = abortController.signal;
  } else if (signal) {
    (axiosOptions as any).signal = signal;
  }
  
  return axiosInstance.post<T>(url, data, axiosOptions);
};

/**
 * Enhanced PUT request with automatic AbortController support
 */
export const enhancedPut = <T = any>(
  url: string,
  data?: any,
  options: EnhancedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, signal, ...axiosOptions } = options;
  
  if (autoAbort && !signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosOptions as any).signal = abortController.signal;
  } else if (signal) {
    (axiosOptions as any).signal = signal;
  }
  
  return axiosInstance.put<T>(url, data, axiosOptions);
};

/**
 * Enhanced DELETE request with automatic AbortController support
 */
export const enhancedDelete = <T = any>(
  url: string,
  options: EnhancedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, signal, ...axiosOptions } = options;
  
  if (autoAbort && !signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosOptions as any).signal = abortController.signal;
  } else if (signal) {
    (axiosOptions as any).signal = signal;
  }
  
  return axiosInstance.delete<T>(url, axiosOptions);
};

/**
 * Enhanced PATCH request with automatic AbortController support
 */
export const enhancedPatch = <T = any>(
  url: string,
  data?: any,
  options: EnhancedRequestOptions = {}
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, signal, ...axiosOptions } = options;
  
  if (autoAbort && !signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosOptions as any).signal = abortController.signal;
  } else if (signal) {
    (axiosOptions as any).signal = signal;
  }
  
  return axiosInstance.patch<T>(url, data, axiosOptions);
};

/**
 * Generic enhanced request function
 */
export const enhancedRequest = <T = any>(
  config: EnhancedAxiosRequestConfig & EnhancedRequestOptions
): Promise<AxiosResponse<T>> => {
  const { autoAbort, requestId, ...axiosConfig } = config;
  
  if (autoAbort && !axiosConfig.signal) {
    const abortController = createManagedAbortController(requestId);
    (axiosConfig as any).signal = abortController.signal;
  }
  
  return axiosInstance.request<T>(axiosConfig);
};

/**
 * Utility function to check if error is a cancellation
 */
export const isCancellationError = (error: unknown): boolean => {
  if (!error) return false;
  
  const axiosError = error as EnhancedAxiosError;
  return (
    axiosError.code === 'ERR_CANCELED' ||
    axiosError.name === 'AbortError' ||
    axiosError.message?.includes('canceled') ||
    axiosError.message?.includes('aborted')
  );
};

/**
 * Safe request wrapper that handles cancellation gracefully
 * 
 * @example
 * ```typescript
 * const { data, error, isCancelled } = await safeRequest(
 *   () => enhancedGet('/products', { autoAbort: true })
 * );
 * 
 * if (isCancelled) {
 *   console.log('Request was cancelled');
 *   return;
 * }
 * 
 * if (error) {
 *   console.error('Request failed:', error);
 *   return;
 * }
 * 
 * console.log('Success:', data);
 * ```
 */
export const safeRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<{
  data?: T;
  response?: AxiosResponse<T>;
  error?: EnhancedAxiosError;
  isCancelled: boolean;
}> => {
  try {
    const response = await requestFn();
    return {
      data: response.data,
      response,
      isCancelled: false
    };
  } catch (error) {
    const isCancelled = isCancellationError(error);
    
    return {
      error: error as EnhancedAxiosError,
      isCancelled
    };
  }
};

/**
 * React hook-style function for making requests with automatic cleanup
 * Returns a function that creates an AbortController and cleans up automatically
 */
export const useApiRequest = () => {
  let currentAbortController: AbortController | null = null;
  
  const makeRequest = <T>(
    requestFn: (signal: AbortSignal) => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> => {
    // Cancel previous request if exists
    if (currentAbortController) {
      currentAbortController.abort('New request initiated');
    }
    
    // Create new AbortController
    currentAbortController = new AbortController();
    
    return requestFn(currentAbortController.signal);
  };
  
  const cleanup = () => {
    if (currentAbortController) {
      currentAbortController.abort('Cleanup requested');
      currentAbortController = null;
    }
  };
  
  return { makeRequest, cleanup };
};

// Re-export the original axiosInstance for backward compatibility
export { default as axiosInstance } from './axiosInstance';

export default {
  get: enhancedGet,
  post: enhancedPost,
  put: enhancedPut,
  delete: enhancedDelete,
  patch: enhancedPatch,
  request: enhancedRequest,
  safeRequest,
  isCancellationError,
  useApiRequest
};
