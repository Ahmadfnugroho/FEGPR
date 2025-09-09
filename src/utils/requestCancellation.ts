// src/utils/requestCancellation.ts
import { CancellationReason, RequestCancellationManager } from '../types/axiosTypes';

/**
 * Request cancellation manager for handling AbortController instances
 * Provides infrastructure for manual request cancellation in the future
 */
export class RequestCancellationService {
  private static instance: RequestCancellationService;
  private activeRequests = new Map<string, RequestCancellationManager>();

  static getInstance(): RequestCancellationService {
    if (!RequestCancellationService.instance) {
      RequestCancellationService.instance = new RequestCancellationService();
    }
    return RequestCancellationService.instance;
  }

  /**
   * Create a new AbortController for a request
   * @param requestId - Unique identifier for the request
   * @param reason - Optional reason for potential cancellation
   * @returns AbortController instance
   */
  createAbortController(requestId: string, reason?: string): AbortController {
    const abortController = new AbortController();
    
    this.activeRequests.set(requestId, {
      abortController,
      reason,
      timestamp: Date.now()
    });

    // Auto-cleanup after request completes or times out
    const cleanup = () => {
      this.activeRequests.delete(requestId);
    };

    // Listen for abort signal
    abortController.signal.addEventListener('abort', cleanup);

    // Cleanup after reasonable timeout (30 seconds)
    setTimeout(cleanup, 30000);

    return abortController;
  }

  /**
   * Cancel a specific request by ID
   * @param requestId - Request identifier
   * @param reason - Reason for cancellation
   * @returns true if request was cancelled, false if not found
   */
  cancelRequest(requestId: string, reason: CancellationReason = 'manual'): boolean {
    const manager = this.activeRequests.get(requestId);
    
    if (!manager || manager.abortController.signal.aborted) {
      return false;
    }

    manager.abortController.abort(`Request cancelled: ${reason}`);
    this.activeRequests.delete(requestId);
    
    return true;
  }

  /**
   * Cancel multiple requests by pattern matching
   * @param pattern - RegExp or string to match request IDs
   * @param reason - Reason for cancellation
   * @returns Array of cancelled request IDs
   */
  cancelRequestsByPattern(pattern: RegExp | string, reason: CancellationReason = 'manual'): string[] {
    const cancelled: string[] = [];
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const [requestId, manager] of this.activeRequests.entries()) {
      if (regex.test(requestId) && !manager.abortController.signal.aborted) {
        manager.abortController.abort(`Bulk cancellation: ${reason}`);
        cancelled.push(requestId);
      }
    }

    // Cleanup cancelled requests
    cancelled.forEach(id => this.activeRequests.delete(id));

    return cancelled;
  }

  /**
   * Cancel all active requests
   * @param reason - Reason for cancellation
   * @returns Number of cancelled requests
   */
  cancelAllRequests(reason: CancellationReason = 'manual'): number {
    const requestIds = Array.from(this.activeRequests.keys());
    
    for (const [requestId, manager] of this.activeRequests.entries()) {
      if (!manager.abortController.signal.aborted) {
        manager.abortController.abort(`Global cancellation: ${reason}`);
      }
    }

    this.activeRequests.clear();
    return requestIds.length;
  }

  /**
   * Check if a request is still active
   * @param requestId - Request identifier
   * @returns true if request is active and not cancelled
   */
  isRequestActive(requestId: string): boolean {
    const manager = this.activeRequests.get(requestId);
    return manager !== undefined && !manager.abortController.signal.aborted;
  }

  /**
   * Get active request count
   * @returns Number of active requests
   */
  getActiveRequestCount(): number {
    return Array.from(this.activeRequests.values())
      .filter(manager => !manager.abortController.signal.aborted).length;
  }

  /**
   * Get list of active request IDs
   * @returns Array of active request IDs
   */
  getActiveRequestIds(): string[] {
    return Array.from(this.activeRequests.entries())
      .filter(([, manager]) => !manager.abortController.signal.aborted)
      .map(([id]) => id);
  }

  /**
   * Cleanup completed or expired requests
   * Called automatically, but can be called manually for cleanup
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    for (const [requestId, manager] of this.activeRequests.entries()) {
      if (
        manager.abortController.signal.aborted ||
        (now - manager.timestamp) > maxAge
      ) {
        this.activeRequests.delete(requestId);
      }
    }
  }

  /**
   * Get debug information about active requests
   * @returns Debug information object
   */
  getDebugInfo() {
    return {
      activeCount: this.getActiveRequestCount(),
      totalManaged: this.activeRequests.size,
      activeRequests: Array.from(this.activeRequests.entries()).map(([id, manager]) => ({
        id,
        reason: manager.reason,
        timestamp: manager.timestamp,
        isAborted: manager.abortController.signal.aborted,
        age: Date.now() - manager.timestamp
      }))
    };
  }
}

// Export singleton instance
export const requestCancellationService = RequestCancellationService.getInstance();

/**
 * Utility function to create AbortController with automatic cleanup
 * For simple use cases where manual management is not needed
 */
export const createManagedAbortController = (requestId?: string): AbortController => {
  const id = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return requestCancellationService.createAbortController(id);
};

/**
 * Hook-like function for React components to get AbortController
 * Can be used in useEffect cleanup
 */
export const useRequestCancellation = (requestId: string) => {
  const abortController = requestCancellationService.createAbortController(requestId);
  
  return {
    signal: abortController.signal,
    cancel: (reason: CancellationReason = 'component-unmount') => {
      requestCancellationService.cancelRequest(requestId, reason);
    },
    isActive: () => requestCancellationService.isRequestActive(requestId)
  };
};

export default requestCancellationService;
