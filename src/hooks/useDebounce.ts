// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing values to prevent excessive API calls
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing booking dates specifically
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced date values
 */
export function useDebouncedBookingDates(
  startDate: string | null,
  endDate: string | null,
  delay: number = 500
): { debouncedStartDate: string | null; debouncedEndDate: string | null } {
  const debouncedStartDate = useDebounce(startDate, delay);
  const debouncedEndDate = useDebounce(endDate, delay);

  return { debouncedStartDate, debouncedEndDate };
}

export default useDebounce;
