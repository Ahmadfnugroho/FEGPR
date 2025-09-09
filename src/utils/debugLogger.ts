// src/utils/debugLogger.ts
import { ApiDebugLog, RequestCancellationInfo } from '../types/apiTypes';

/**
 * Debug logger configuration
 */
interface DebugConfig {
  enabled: boolean;
  level: 'verbose' | 'normal' | 'minimal';
  persistLogs: boolean;
  maxLogEntries: number;
}

// Default configuration
const defaultConfig: DebugConfig = {
  enabled: process.env.NODE_ENV === 'development',
  level: 'normal',
  persistLogs: true,
  maxLogEntries: 100
};

// In-memory log storage
let logEntries: ApiDebugLog[] = [];
let currentConfig = { ...defaultConfig };

/**
 * Generate unique log ID
 */
const generateLogId = (): string => {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Add log entry to storage
 */
const addLogEntry = (log: ApiDebugLog): void => {
  logEntries.unshift(log);
  
  // Keep only the most recent entries
  if (logEntries.length > currentConfig.maxLogEntries) {
    logEntries = logEntries.slice(0, currentConfig.maxLogEntries);
  }
  
  // Persist to localStorage if enabled
  if (currentConfig.persistLogs && typeof Storage !== 'undefined') {
    try {
      localStorage.setItem('api_debug_logs', JSON.stringify(logEntries.slice(0, 50)));
    } catch (error) {
      // Ignore localStorage errors
    }
  }
};

/**
 * Debug logger class
 */
export class DebugLogger {
  private static instance: DebugLogger;
  
  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  /**
   * Update debug configuration
   */
  configure(config: Partial<DebugConfig>): void {
    currentConfig = { ...currentConfig, ...config };
    console.log('🔧 [DebugLogger] Configuration updated:', currentConfig);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any, startTime?: number): string {
    if (!currentConfig.enabled) return '';

    const logId = generateLogId();
    const timestamp = new Date().toISOString();

    const logEntry: ApiDebugLog = {
      id: logId,
      timestamp,
      type: 'request',
      method: method.toUpperCase(),
      url,
      data: currentConfig.level === 'verbose' ? data : undefined
    };

    addLogEntry(logEntry);

    if (currentConfig.level !== 'minimal') {
      console.group(`🚀 [API Request] ${method.toUpperCase()} ${url}`);
      console.log('📍 Timestamp:', timestamp);
      console.log('🆔 Request ID:', logId);
      if (currentConfig.level === 'verbose' && data) {
        console.log('📦 Request Data:', data);
      }
      console.groupEnd();
    }

    return logId;
  }

  /**
   * Log API response
   */
  logResponse(requestId: string, status: number, data?: any, duration?: number): void {
    if (!currentConfig.enabled) return;

    const logId = generateLogId();
    const timestamp = new Date().toISOString();

    const logEntry: ApiDebugLog = {
      id: logId,
      timestamp,
      type: 'response',
      status,
      duration,
      data: currentConfig.level === 'verbose' ? data : undefined
    };

    addLogEntry(logEntry);

    if (currentConfig.level !== 'minimal') {
      console.group(`✅ [API Response] ${status} ${duration ? `(${duration}ms)` : ''}`);
      console.log('📍 Timestamp:', timestamp);
      console.log('🆔 Response ID:', logId);
      if (requestId) console.log('🔗 Request ID:', requestId);
      if (currentConfig.level === 'verbose' && data) {
        console.log('📦 Response Data:', data);
      }
      console.groupEnd();
    }
  }

  /**
   * Log API error
   */
  logError(method: string, url: string, error: any, duration?: number): void {
    if (!currentConfig.enabled) return;

    const logId = generateLogId();
    const timestamp = new Date().toISOString();

    const logEntry: ApiDebugLog = {
      id: logId,
      timestamp,
      type: 'error',
      method: method?.toUpperCase(),
      url,
      error: error.message || String(error),
      status: error.response?.status,
      duration
    };

    addLogEntry(logEntry);

    console.group(`❌ [API Error] ${method?.toUpperCase()} ${url}`);
    console.log('📍 Timestamp:', timestamp);
    console.log('🆔 Error ID:', logId);
    console.log('💥 Error:', error);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📦 Error Data:', error.response.data);
    }
    if (duration) console.log('⏱️ Duration:', `${duration}ms`);
    console.groupEnd();
  }

  /**
   * Log request cancellation
   */
  logCancellation(method: string, url: string, reason: string): void {
    if (!currentConfig.enabled) return;

    const logId = generateLogId();
    const timestamp = new Date().toISOString();

    const cancelInfo: RequestCancellationInfo = {
      reason,
      timestamp,
      url,
      method: method?.toUpperCase()
    };

    const logEntry: ApiDebugLog = {
      id: logId,
      timestamp,
      type: 'cancellation',
      method: method?.toUpperCase(),
      url,
      cancelInfo
    };

    addLogEntry(logEntry);

    if (currentConfig.level !== 'minimal') {
      console.group(`🚫 [API Cancelled] ${method?.toUpperCase()} ${url}`);
      console.log('📍 Timestamp:', timestamp);
      console.log('🆔 Cancellation ID:', logId);
      console.log('💬 Reason:', reason);
      console.groupEnd();
    }
  }

  /**
   * Log data validation
   */
  logValidation(type: 'product' | 'bundling' | 'photos', data: any, result: any): void {
    if (!currentConfig.enabled || currentConfig.level === 'minimal') return;

    console.group(`🔍 [Data Validation] ${type}`);
    console.log('📍 Timestamp:', new Date().toISOString());
    if (currentConfig.level === 'verbose') {
      console.log('📦 Input Data:', data);
    }
    console.log('📊 Validation Result:', result);
    console.groupEnd();
  }

  /**
   * Log state changes
   */
  logStateChange(component: string, oldState: any, newState: any, reason?: string): void {
    if (!currentConfig.enabled || currentConfig.level === 'minimal') return;

    console.group(`🔄 [State Change] ${component}`);
    console.log('📍 Timestamp:', new Date().toISOString());
    if (reason) console.log('💬 Reason:', reason);
    
    if (currentConfig.level === 'verbose') {
      console.log('📤 Old State:', oldState);
      console.log('📥 New State:', newState);
    } else {
      // Show only changed fields
      const changes = this.getStateChanges(oldState, newState);
      if (Object.keys(changes).length > 0) {
        console.log('🔀 Changes:', changes);
      }
    }
    console.groupEnd();
  }

  /**
   * Get differences between two state objects
   */
  private getStateChanges(oldState: any, newState: any): Record<string, any> {
    const changes: Record<string, any> = {};
    
    if (!oldState || !newState) return changes;

    for (const key in newState) {
      if (oldState[key] !== newState[key]) {
        changes[key] = {
          from: oldState[key],
          to: newState[key]
        };
      }
    }

    return changes;
  }

  /**
   * Log photo validation results
   */
  logPhotoValidation(productName: string, totalPhotos: number, validPhotos: number, errors: string[] = []): void {
    if (!currentConfig.enabled) return;

    const isValid = validPhotos > 0;
    const icon = isValid ? '📷' : '🚫';
    
    console.group(`${icon} [Photo Validation] ${productName}`);
    console.log('📍 Timestamp:', new Date().toISOString());
    console.log('📊 Summary:', {
      totalPhotos,
      validPhotos,
      invalidPhotos: totalPhotos - validPhotos,
      isValid
    });
    
    if (errors.length > 0) {
      console.log('⚠️ Errors:', errors);
    }
    console.groupEnd();
  }

  /**
   * Get all log entries
   */
  getLogs(): ApiDebugLog[] {
    return [...logEntries];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    logEntries = [];
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.removeItem('api_debug_logs');
      } catch (error) {
        // Ignore localStorage errors
      }
    }
    console.log('🧹 [DebugLogger] All logs cleared');
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(logEntries, null, 2);
  }

  /**
   * Get logs summary
   */
  getLogsSummary(): { total: number; requests: number; responses: number; errors: number; cancellations: number } {
    return {
      total: logEntries.length,
      requests: logEntries.filter(log => log.type === 'request').length,
      responses: logEntries.filter(log => log.type === 'response').length,
      errors: logEntries.filter(log => log.type === 'error').length,
      cancellations: logEntries.filter(log => log.type === 'cancellation').length
    };
  }

  /**
   * Search logs by criteria
   */
  searchLogs(criteria: Partial<ApiDebugLog>): ApiDebugLog[] {
    return logEntries.filter(log => {
      return Object.keys(criteria).every(key => {
        const criteriaValue = (criteria as any)[key];
        const logValue = (log as any)[key];
        
        if (typeof criteriaValue === 'string') {
          return logValue?.toString().toLowerCase().includes(criteriaValue.toLowerCase());
        }
        
        return logValue === criteriaValue;
      });
    });
  }
}

// Create singleton instance
const debugLogger = DebugLogger.getInstance();

// Load persisted logs on initialization
if (typeof Storage !== 'undefined') {
  try {
    const persistedLogs = localStorage.getItem('api_debug_logs');
    if (persistedLogs) {
      logEntries = JSON.parse(persistedLogs);
    }
  } catch (error) {
    // Ignore localStorage errors
  }
}

// Export singleton instance and utility functions
export default debugLogger;

/**
 * Convenience functions
 */
export const logRequest = (method: string, url: string, data?: any, startTime?: number) => 
  debugLogger.logRequest(method, url, data, startTime);

export const logResponse = (requestId: string, status: number, data?: any, duration?: number) => 
  debugLogger.logResponse(requestId, status, data, duration);

export const logError = (method: string, url: string, error: any, duration?: number) => 
  debugLogger.logError(method, url, error, duration);

export const logCancellation = (method: string, url: string, reason: string) => 
  debugLogger.logCancellation(method, url, reason);

export const logValidation = (type: 'product' | 'bundling' | 'photos', data: any, result: any) => 
  debugLogger.logValidation(type, data, result);

export const logStateChange = (component: string, oldState: any, newState: any, reason?: string) => 
  debugLogger.logStateChange(component, oldState, newState, reason);

export const logPhotoValidation = (productName: string, totalPhotos: number, validPhotos: number, errors?: string[]) => 
  debugLogger.logPhotoValidation(productName, totalPhotos, validPhotos, errors);
