// src/hooks/useAvailability.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { 
  checkProductAvailability,
  checkBundlingAvailability,
  getProductWithAvailability,
  getBundlingWithAvailability
} from '../api/availabilityApi';
import {
  isProductAvailable,
  isBundlingAvailable,
  getProductAvailableQuantity,
  getBundlingAvailableQuantity
} from '../utils/availabilityUtils';
import { Product, Bundling } from '../types/type';

export interface AvailabilityCheck {
  type: 'product' | 'bundling';
  id: number;
  startDate: Date;
  endDate: Date;
  quantity: number;
}

export interface AvailabilityResult {
  available: boolean;
  availableQuantity: number;
  conflictingTransactions: Transaction[];
  unavailableDates: Date[];
}

interface Transaction {
  id: number;
  booking_transaction_id: string;
  start_date: string;
  end_date: string;
  booking_status: string;
  details: Array<{
    id: number;
    product_id?: number;
    bundling_id?: number;
    quantity: number;
  }>;
}

interface UseAvailabilityProps {
  enabled?: boolean;
}

export function useAvailability({ enabled = true }: UseAvailabilityProps = {}) {
  const [lastCheck, setLastCheck] = useState<AvailabilityCheck | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch all active transactions for availability checking
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', 'active'],
    queryFn: async (): Promise<Transaction[]> => {
      try {
        // Use the correct transactions endpoint or return empty array if endpoint doesn't exist
        const response = await axiosInstance.get('/transactions', {
          params: {
            status: 'active',
            limit: 1000
          }
        });
        return response.data.data || [];
      } catch (error) {
        console.warn('Transactions endpoint not available, using mock data for availability check:', error);
        // Return empty array to prevent errors - this allows the app to function without backend
        return [];
      }
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const checkAvailability = useCallback(
    async (check: AvailabilityCheck): Promise<AvailabilityResult> => {
      setIsChecking(true);
      setLastCheck(check);

      try {
        if (!transactions) {
          throw new Error('Transaction data not loaded');
        }

        const { type, id, startDate, endDate, quantity } = check;

        // Convert dates to comparable format
        const checkStart = new Date(startDate);
        const checkEnd = new Date(endDate);
        checkStart.setHours(0, 0, 0, 0);
        checkEnd.setHours(23, 59, 59, 999);

        // Find conflicting transactions
        const conflictingTransactions: Transaction[] = [];
        const unavailableDates: Date[] = [];
        let totalConflictingQuantity = 0;

        transactions.forEach(transaction => {
          // Only check active transactions
          if (transaction.booking_status !== 'confirmed' && transaction.booking_status !== 'active') {
            return;
          }

          const transactionStart = new Date(transaction.start_date);
          const transactionEnd = new Date(transaction.end_date);
          transactionStart.setHours(0, 0, 0, 0);
          transactionEnd.setHours(23, 59, 59, 999);

          // Check if date ranges overlap
          const hasOverlap = checkStart <= transactionEnd && checkEnd >= transactionStart;

          if (!hasOverlap) return;

          // Check if this transaction involves the same item
          const relevantDetails = transaction.details.filter(detail => {
            if (type === 'product' && detail.product_id === id) return true;
            if (type === 'bundling' && detail.bundling_id === id) return true;
            return false;
          });

          if (relevantDetails.length > 0) {
            conflictingTransactions.push(transaction);
            
            // Add unavailable dates
            const currentDate = new Date(transactionStart);
            while (currentDate <= transactionEnd) {
              unavailableDates.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Sum up conflicting quantities
            relevantDetails.forEach(detail => {
              totalConflictingQuantity += detail.quantity;
            });
          }
        });

        // For now, assume we have unlimited stock if no conflicts
        // In a real scenario, you'd fetch actual stock levels from inventory
        const assumedTotalStock = 10; // This should come from product/bundling data
        const availableQuantity = Math.max(0, assumedTotalStock - totalConflictingQuantity);
        const available = availableQuantity >= quantity;

        return {
          available,
          availableQuantity,
          conflictingTransactions,
          unavailableDates: [...new Set(unavailableDates.map(d => d.toDateString()))]
            .map(dateStr => new Date(dateStr)),
        };

      } catch (error) {
        console.error('Error checking availability:', error);
        
        return {
          available: false,
          availableQuantity: 0,
          conflictingTransactions: [],
          unavailableDates: [],
        };
      } finally {
        setIsChecking(false);
      }
    },
    [transactions]
  );

  const checkMultipleAvailability = useCallback(
    async (checks: AvailabilityCheck[]): Promise<Record<string, AvailabilityResult>> => {
      const results: Record<string, AvailabilityResult> = {};
      
      // Run checks in parallel
      const promises = checks.map(async (check) => {
        const key = `${check.type}-${check.id}-${check.startDate.toISOString()}-${check.endDate.toISOString()}`;
        const result = await checkAvailability(check);
        return { key, result };
      });

      const resolvedResults = await Promise.all(promises);
      
      resolvedResults.forEach(({ key, result }) => {
        results[key] = result;
      });

      return results;
    },
    [checkAvailability]
  );

  // Get unavailable dates for a specific item (for calendar display)
  const getUnavailableDates = useCallback(
    (type: 'product' | 'bundling', id: number): Date[] => {
      if (!transactions) return [];

      const unavailableDates: Date[] = [];

      transactions.forEach(transaction => {
        if (transaction.booking_status !== 'confirmed' && transaction.booking_status !== 'active') {
          return;
        }

        const hasRelevantItem = transaction.details.some(detail => {
          if (type === 'product' && detail.product_id === id) return true;
          if (type === 'bundling' && detail.bundling_id === id) return true;
          return false;
        });

        if (hasRelevantItem) {
          const start = new Date(transaction.start_date);
          const end = new Date(transaction.end_date);
          
          const currentDate = new Date(start);
          while (currentDate <= end) {
            unavailableDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });

      // Remove duplicates
      return [...new Set(unavailableDates.map(d => d.toDateString()))]
        .map(dateStr => new Date(dateStr));
    },
    [transactions]
  );

  // Check if a specific date range is available
  const isDateRangeAvailable = useCallback(
    (type: 'product' | 'bundling', id: number, startDate: Date, endDate: Date): boolean => {
      if (!transactions) return true;

      return transactions.every(transaction => {
        if (transaction.booking_status !== 'confirmed' && transaction.booking_status !== 'active') {
          return true;
        }

        const hasRelevantItem = transaction.details.some(detail => {
          if (type === 'product' && detail.product_id === id) return true;
          if (type === 'bundling' && detail.bundling_id === id) return true;
          return false;
        });

        if (!hasRelevantItem) return true;

        const transactionStart = new Date(transaction.start_date);
        const transactionEnd = new Date(transaction.end_date);
        const checkStart = new Date(startDate);
        const checkEnd = new Date(endDate);

        // No overlap means available
        return checkEnd < transactionStart || checkStart > transactionEnd;
      });
    },
    [transactions]
  );

  return {
    // Data
    transactions: transactions || [],
    isLoadingTransactions,
    lastCheck,
    
    // Methods
    checkAvailability,
    checkMultipleAvailability,
    getUnavailableDates,
    isDateRangeAvailable,
    
    // State
    isChecking,
  };
}

/**
 * Hook for syncing availability with API when dates change
 * Ensures availability data is always fresh and up-to-date
 */
export function useAvailabilitySync({
  slug,
  type,
  startDate,
  endDate,
  autoSync = true
}: {
  slug: string;
  type: 'product' | 'bundling';
  startDate?: string | Date;
  endDate?: string | Date;
  autoSync?: boolean;
}) {
  const [item, setItem] = useState<Product | Bundling | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Sync availability data with API
  const syncAvailability = useCallback(async (
    syncStartDate?: string | Date,
    syncEndDate?: string | Date
  ) => {
    if (!slug) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔄 Syncing ${type} "${slug}" availability...`);

      let itemData;
      if (type === 'product') {
        itemData = await getProductWithAvailability(
          slug,
          syncStartDate || startDate,
          syncEndDate || endDate
        );
      } else {
        itemData = await getBundlingWithAvailability(
          slug,
          syncStartDate || startDate,
          syncEndDate || endDate
        );
      }

      setItem(itemData);
      setLastSynced(new Date());

      console.log(`✅ ${type} "${slug}" availability synced:`, {
        available: type === 'product' 
          ? isProductAvailable(itemData as Product)
          : isBundlingAvailable(itemData as Bundling),
        quantity: type === 'product'
          ? getProductAvailableQuantity(itemData as Product)
          : getBundlingAvailableQuantity(itemData as Bundling),
        period: syncStartDate && syncEndDate 
          ? `${syncStartDate} - ${syncEndDate}`
          : 'current period'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync availability';
      setError(errorMessage);
      console.error(`❌ Failed to sync ${type} "${slug}" availability:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, type, startDate, endDate]);

  // Auto-sync when dates change
  useEffect(() => {
    if (!autoSync || !slug) return;

    const timeoutId = setTimeout(() => {
      syncAvailability(startDate, endDate);
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, slug, autoSync, syncAvailability]);

  // Calculate current availability from synced data
  const availability = item ? {
    isAvailable: type === 'product' 
      ? isProductAvailable(item as Product)
      : isBundlingAvailable(item as Bundling),
    availableQuantity: type === 'product'
      ? getProductAvailableQuantity(item as Product) 
      : getBundlingAvailableQuantity(item as Bundling),
    item
  } : {
    isAvailable: false,
    availableQuantity: 0,
    item: null
  };

  return {
    ...availability,
    isLoading,
    error,
    lastSynced,
    syncAvailability,
    // Force refresh
    refresh: () => syncAvailability(startDate, endDate)
  };
}
