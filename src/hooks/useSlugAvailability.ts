// src/hooks/useSlugAvailability.ts
import { useState, useCallback } from 'react';
import { checkAvailability, AvailabilityParams } from '../api/availabilityApi';

export interface AvailabilityCheck {
  type: 'product' | 'bundling';
  slug: string;
  startDate: Date | string;
  endDate: Date | string;
  quantity: number;
}

export interface AvailabilityResult {
  available: boolean;
  availableQuantity: number;
  totalQuantity: number;
  conflictingTransactions: any[];
  message?: string;
}

export function useSlugAvailability() {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<AvailabilityCheck | null>(null);

  const checkItemAvailability = useCallback(
    async (check: AvailabilityCheck): Promise<AvailabilityResult> => {
      setIsChecking(true);
      setLastCheck(check);

      try {
        const { type, slug, startDate, endDate, quantity } = check;

        const response = await checkAvailability(type, {
          slug,
          startDate,
          endDate
        });

        // Check if requested quantity is available
        const hasEnoughQuantity = response.available_quantity >= quantity;

        return {
          available: response.available && hasEnoughQuantity,
          availableQuantity: response.available_quantity,
          totalQuantity: response.total_quantity,
          conflictingTransactions: response.conflicting_transactions || [],
          message: hasEnoughQuantity 
            ? undefined 
            : `Hanya ${response.available_quantity} unit tersedia untuk periode ini`
        };

      } catch (error) {
        console.error('Error checking availability:', error);
        
        return {
          available: false,
          availableQuantity: 0,
          totalQuantity: 0,
          conflictingTransactions: [],
          message: error instanceof Error ? error.message : 'Gagal memeriksa ketersediaan'
        };
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  return {
    checkItemAvailability,
    isChecking,
    lastCheck,
  };
}

export default useSlugAvailability;
