// src/utils/debugLogger.ts
import { ApiDebugLog, RequestCancellationInfo } from '../types/apiTypes';

interface DebugConfig {
  enabled: boolean;
  level: 'verbose' | 'normal' | 'minimal';
  maxLogEntries: number;
}

const defaultConfig: DebugConfig = {
  enabled: import.meta.env.DEV,
  level: 'normal',
  maxLogEntries: 100
};

let logEntries: ApiDebugLog[] = [];
const currentConfig = { ...defaultConfig };

const generateLogId = (): string => {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const addLogEntry = (log: ApiDebugLog): void => {
  logEntries.unshift(log);
  if (logEntries.length > currentConfig.maxLogEntries) {
    logEntries = logEntries.slice(0, currentConfig.maxLogEntries);
  }
};

export class DebugLogger {
  private static instance: DebugLogger;

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  logRequest(method: string, url: string, data?: any): string {
    if (!currentConfig.enabled) return '';

    const logId = generateLogId();
    const logEntry: ApiDebugLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      type: 'request',
      method: method.toUpperCase(),
      url,
      data: currentConfig.level === 'verbose' ? data : undefined
    };

    addLogEntry(logEntry);

    return logId;
  }

  logResponse(requestId: string, status: number, data?: any, duration?: number): void {
    if (!currentConfig.enabled) return;

    addLogEntry({
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      type: 'response',
      status,
      duration,
      data: currentConfig.level === 'verbose' ? data : undefined
    });
  }

  logError(method: string, url: string, error: any, duration?: number): void {
    if (!currentConfig.enabled) return;

    addLogEntry({
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      type: 'error',
      method: method?.toUpperCase(),
      url,
      error: error.message || String(error),
      status: error.response?.status,
      duration
    });
  }

  logCancellation(method: string, url: string, reason: string): void {
    if (!currentConfig.enabled) return;

    const cancelInfo: RequestCancellationInfo = {
      reason,
      timestamp: new Date().toISOString(),
      url,
      method: method?.toUpperCase()
    };

    addLogEntry({
      id: generateLogId(),
      timestamp: cancelInfo.timestamp,
      type: 'cancellation',
      method: cancelInfo.method,
      url,
      cancelInfo
    });
  }
}

const debugLogger = DebugLogger.getInstance();

export default debugLogger;
