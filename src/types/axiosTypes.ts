// src/types/axiosTypes.ts
import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Extended Axios request config with custom properties for tracking
 */
export interface EnhancedAxiosRequestConfig extends InternalAxiosRequestConfig {
  __startTime?: number;
  __requestId?: string;
}

/**
 * Enhanced Axios Error with custom error message and typed config
 */
export interface EnhancedAxiosError<T = any> extends AxiosError<T> {
  config?: EnhancedAxiosRequestConfig;
  errorMessage?: string;
}

/**
 * Enhanced Axios response with enhanced config  
 */
export interface EnhancedAxiosResponse<T = any> extends AxiosResponse<T> {
  config: EnhancedAxiosRequestConfig;
}

/**
 * AbortController manager for request cancellation
 */
export interface RequestCancellationManager {
  abortController: AbortController;
  reason?: string;
  timestamp: number;
}

/**
 * Request metadata for debugging and tracking
 */
export interface RequestMetadata {
  id: string;
  method: string;
  url: string;
  baseURL?: string;
  startTime: number;
  abortController?: AbortController;
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  enableDebugLogging: boolean;
  enableCancellationLogging: boolean;
  enableErrorMessages: boolean;
  retryableStatusCodes: number[];
}

/**
 * Cancellation types for different scenarios
 */
export type CancellationReason = 
  | 'user-initiated'
  | 'timeout'
  | 'navigation'
  | 'component-unmount'
  | 'new-request'
  | 'manual'
  | 'unknown';

/**
 * Request cancellation info with typed reason
 */
export interface TypedCancellationInfo {
  reason: CancellationReason;
  message?: string;
  timestamp: number;
  requestId?: string;
}

/**
 * Network error types
 */
export type NetworkErrorType = 
  | 'network'
  | 'timeout'  
  | 'abort'
  | 'dns'
  | 'connection-refused'
  | 'unknown';

/**
 * Enhanced error classification
 */
export interface ErrorClassification {
  type: 'response' | 'request' | 'network' | 'cancellation' | 'setup';
  category: string;
  isRetryable: boolean;
  statusCode?: number;
  networkErrorType?: NetworkErrorType;
}

/**
 * Type guards for error handling
 */
export const isEnhancedAxiosError = (error: any): error is EnhancedAxiosError => {
  return error && error.isAxiosError === true;
};

export const isAbortError = (error: any): boolean => {
  return error && (
    error.name === 'AbortError' || 
    error.code === 'ERR_CANCELED' ||
    error.message?.includes('aborted')
  );
};

export const isNetworkError = (error: EnhancedAxiosError): boolean => {
  return !error.response && !!error.request;
};

export const isTimeoutError = (error: EnhancedAxiosError): boolean => {
  return error.code === 'ECONNABORTED' || 
         error.code === 'ERR_NETWORK' ||
         error.message?.includes('timeout');
};

/**
 * Utility functions for error handling
 */
export const getErrorUrl = (error: EnhancedAxiosError): string => {
  const config = error.config;
  if (!config) return 'unknown';
  
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  
  // Handle cases where url might already include baseURL
  if (url.startsWith('http')) {
    return url;
  }
  
  return `${baseURL}${url}`.replace(/\/+/g, '/').replace(/:\//g, '://');
};

export const getErrorMethod = (error: EnhancedAxiosError): string => {
  return error.config?.method?.toUpperCase() || 'UNKNOWN';
};

export const classifyError = (error: EnhancedAxiosError): ErrorClassification => {
  // Cancellation errors
  if (isAbortError(error)) {
    return {
      type: 'cancellation',
      category: 'user-cancelled',
      isRetryable: false
    };
  }

  // Response errors (4xx, 5xx)
  if (error.response) {
    const status = error.response.status;
    return {
      type: 'response',
      category: status >= 500 ? 'server-error' : 'client-error',
      isRetryable: status >= 500 && status < 600,
      statusCode: status
    };
  }

  // Network/Request errors
  if (error.request) {
    if (isTimeoutError(error)) {
      return {
        type: 'network',
        category: 'timeout',
        isRetryable: true,
        networkErrorType: 'timeout'
      };
    }

    return {
      type: 'network', 
      category: 'network-error',
      isRetryable: true,
      networkErrorType: 'network'
    };
  }

  // Setup errors
  return {
    type: 'setup',
    category: 'configuration-error',
    isRetryable: false
  };
};
