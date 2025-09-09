// src/hooks/useBookingDates.tsx
import { useState, useCallback, useMemo } from 'react';

export interface BookingDatesState {
  startDate: string | null;
  endDate: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export interface UseBookingDatesReturn extends BookingDatesState {
  // Date string setters
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  
  // Date object setters
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  
  // Combined setter for both dates
  setDates: (startDate: string | null, endDate: string | null) => void;
  
  // Utility functions
  clearDates: () => void;
  isDateRangeValid: boolean;
  areDatesSelected: boolean;
  
  // Formatted date strings for display
  formattedDateRange: string;
}

/**
 * Custom hook for managing booking dates with persistent state
 * Prevents date loss during component re-renders and provides
 * consistent date handling across components
 */
export const useBookingDates = (initialStartDate?: string, initialEndDate?: string): UseBookingDatesReturn => {
  // Primary state: string dates (for API calls)
  const [startDate, setStartDateState] = useState<string | null>(initialStartDate || null);
  const [endDate, setEndDateState] = useState<string | null>(initialEndDate || null);

  // Derived state: Date objects (for DatePicker components)
  const dateRange = useMemo(() => ({
    startDate: startDate ? new Date(startDate + 'T00:00:00') : null,
    endDate: endDate ? new Date(endDate + 'T00:00:00') : null,
  }), [startDate, endDate]);

  // Utility computed values
  const isDateRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) < new Date(endDate);
  }, [startDate, endDate]);

  const areDatesSelected = useMemo(() => {
    return !!(startDate && endDate);
  }, [startDate, endDate]);

  const formattedDateRange = useMemo(() => {
    if (!startDate || !endDate) return 'Pilih tanggal';
    
    const start = new Date(startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const end = new Date(endDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  }, [startDate, endDate]);

  // Setters for string dates
  const setStartDate = useCallback((date: string | null) => {
    setStartDateState(date);
  }, []);

  const setEndDate = useCallback((date: string | null) => {
    setEndDateState(date);
  }, []);

  // Setter for Date objects (converts to string internally)
  const setDateRange = useCallback((range: { startDate: Date | null; endDate: Date | null }) => {
    const startDateString = range.startDate 
      ? range.startDate.toISOString().split('T')[0]
      : null;
    const endDateString = range.endDate 
      ? range.endDate.toISOString().split('T')[0] 
      : null;
    
    setStartDateState(startDateString);
    setEndDateState(endDateString);
  }, []);

  // Combined setter for both dates
  const setDates = useCallback((newStartDate: string | null, newEndDate: string | null) => {
    setStartDateState(newStartDate);
    setEndDateState(newEndDate);
  }, []);

  // Clear all dates
  const clearDates = useCallback(() => {
    setStartDateState(null);
    setEndDateState(null);
  }, []);

  return {
    // State values
    startDate,
    endDate,
    dateRange,
    
    // Setters
    setStartDate,
    setEndDate,
    setDateRange,
    setDates,
    clearDates,
    
    // Computed values
    isDateRangeValid,
    areDatesSelected,
    formattedDateRange,
  };
};

export default useBookingDates;
