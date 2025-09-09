// src/contexts/BookingDatesContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  createDateRangeFromStrings, 
  dateRangeToLocalStrings, 
  isValidDateString, 
  formatDateLocal,
  debugDate 
} from '../utils/dateUtils';

export interface BookingDatesState {
  startDate: string | null;
  endDate: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export interface BookingDatesContextType extends BookingDatesState {
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
  
  // Debug information
  lastUpdateTime: number;
  updateCount: number;
}

const BookingDatesContext = createContext<BookingDatesContextType | undefined>(undefined);

// Keys for localStorage
const STORAGE_KEYS = {
  START_DATE: 'booking_start_date',
  END_DATE: 'booking_end_date',
} as const;

interface BookingDatesProviderProps {
  children: React.ReactNode;
  enablePersistence?: boolean;
}

export const BookingDatesProvider: React.FC<BookingDatesProviderProps> = ({ 
  children, 
  enablePersistence = true 
}) => {
  // Load initial state from localStorage if persistence is enabled
  const getInitialDates = useCallback(() => {
    if (!enablePersistence || typeof window === 'undefined') {
      return { startDate: null, endDate: null };
    }

    try {
      const savedStartDate = localStorage.getItem(STORAGE_KEYS.START_DATE);
      const savedEndDate = localStorage.getItem(STORAGE_KEYS.END_DATE);
      
      console.log('🔄 Loading dates from localStorage:', { 
        savedStartDate, 
        savedEndDate 
      });

      return {
        startDate: savedStartDate || null,
        endDate: savedEndDate || null,
      };
    } catch (error) {
      console.error('❌ Error loading dates from localStorage:', error);
      return { startDate: null, endDate: null };
    }
  }, [enablePersistence]);

  // Initialize state
  const initialDates = getInitialDates();
  const [startDate, setStartDateState] = useState<string | null>(initialDates.startDate);
  const [endDate, setEndDateState] = useState<string | null>(initialDates.endDate);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Debug logging for state changes
  useEffect(() => {
    console.log('📅 BookingDatesContext state changed:', {
      startDate,
      endDate,
      updateCount,
      timestamp: new Date().toISOString(),
      source: 'context_state_change'
    });
  }, [startDate, endDate, updateCount]);

  // Debounced localStorage persistence to prevent excessive writes
  useEffect(() => {
    if (!enablePersistence || typeof window === 'undefined') return;

    // Debounce localStorage writes to prevent excessive disk I/O
    const persistTimeout = setTimeout(() => {
      try {
        if (startDate) {
          localStorage.setItem(STORAGE_KEYS.START_DATE, startDate);
          console.log('💾 Saved startDate to localStorage:', startDate);
        } else {
          localStorage.removeItem(STORAGE_KEYS.START_DATE);
          console.log('🗑️ Removed startDate from localStorage');
        }

        if (endDate) {
          localStorage.setItem(STORAGE_KEYS.END_DATE, endDate);
          console.log('💾 Saved endDate to localStorage:', endDate);
        } else {
          localStorage.removeItem(STORAGE_KEYS.END_DATE);
          console.log('🗑️ Removed endDate from localStorage');
        }
      } catch (error) {
        console.error('❌ Error saving dates to localStorage:', error);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(persistTimeout);
  }, [startDate, endDate, enablePersistence]);

  // Derived state: Date objects (for DatePicker components)
  // Uses timezone-safe conversion to prevent date shifts
  const dateRange = useMemo(() => {
    const range = createDateRangeFromStrings(startDate, endDate);

    console.log('📊 DateRange computed (timezone-safe):', {
      input: { startDate, endDate },
      output: {
        startDate: range.startDate?.toString(),
        endDate: range.endDate?.toString()
      },
      startDateValid: range.startDate instanceof Date && !isNaN(range.startDate.getTime()),
      endDateValid: range.endDate instanceof Date && !isNaN(range.endDate.getTime()),
      source: 'dateRange_memo_timezone_safe'
    });

    // Debug timezone information
    if (range.startDate) debugDate('Context startDate', range.startDate);
    if (range.endDate) debugDate('Context endDate', range.endDate);

    return range;
  }, [startDate, endDate]);

  // Utility computed values - using timezone-safe validation
  const isDateRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
      console.warn('Invalid date strings detected:', { startDate, endDate });
      return false;
    }
    
    // Compare using Date objects created safely
    const start = createDateRangeFromStrings(startDate, null).startDate;
    const end = createDateRangeFromStrings(null, endDate).endDate;
    const isValid = !!(start && end && start < end);
    
    console.log('✅ DateRange validity check (timezone-safe):', {
      startDate,
      endDate,
      startDateObject: start?.toString(),
      endDateObject: end?.toString(),
      isValid,
      source: 'validity_check_timezone_safe'
    });
    
    return isValid;
  }, [startDate, endDate]);

  const areDatesSelected = useMemo(() => {
    const selected = !!(startDate && endDate);
    console.log('🎯 Dates selection check:', {
      startDate,
      endDate,
      areDatesSelected: selected,
      source: 'selection_check'
    });
    return selected;
  }, [startDate, endDate]);

  const formattedDateRange = useMemo(() => {
    if (!startDate || !endDate) return 'Pilih tanggal';
    
    try {
      // Use timezone-safe date conversion
      const dateRange = createDateRangeFromStrings(startDate, endDate);
      const start = formatDateLocal(dateRange.startDate, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const end = formatDateLocal(dateRange.endDate, {
        day: 'numeric',
        month: 'short', 
        year: 'numeric'
      });
      
      const formatted = `${start} - ${end}`;
      console.log('🎨 Formatted date range (timezone-safe):', {
        input: { startDate, endDate },
        dateObjects: {
          start: dateRange.startDate?.toString(),
          end: dateRange.endDate?.toString()
        },
        output: formatted,
        source: 'format_memo_timezone_safe'
      });
      return formatted;
    } catch (error) {
      console.error('❌ Error formatting date range:', error);
      return 'Format error';
    }
  }, [startDate, endDate]);

  // Update helper function
  const incrementUpdateCount = useCallback(() => {
    setUpdateCount(prev => prev + 1);
    setLastUpdateTime(Date.now());
  }, []);

  // Setters for string dates
  const setStartDate = useCallback((date: string | null) => {
    console.log('🔄 setStartDate called:', {
      oldValue: startDate,
      newValue: date,
      source: 'setStartDate_call',
      stack: new Error().stack?.split('\n').slice(1, 4)
    });
    setStartDateState(date);
    incrementUpdateCount();
  }, [startDate, incrementUpdateCount]);

  const setEndDate = useCallback((date: string | null) => {
    console.log('🔄 setEndDate called:', {
      oldValue: endDate,
      newValue: date,
      source: 'setEndDate_call',
      stack: new Error().stack?.split('\n').slice(1, 4)
    });
    setEndDateState(date);
    incrementUpdateCount();
  }, [endDate, incrementUpdateCount]);

  // Setter for Date objects (converts to local string internally)
  // This is the CRITICAL fix - no more UTC conversion that shifts dates
  const setDateRange = useCallback((range: { startDate: Date | null; endDate: Date | null }) => {
    // Use timezone-safe conversion to local date strings
    const localStrings = dateRangeToLocalStrings(range);
    
    console.log('🔄 setDateRange called (timezone-safe):', {
      input: {
        startDate: range.startDate?.toString(),
        endDate: range.endDate?.toString()
      },
      converted: localStrings,
      oldValues: { startDate, endDate },
      source: 'setDateRange_call_timezone_safe',
      stack: new Error().stack?.split('\n').slice(1, 4)
    });
    
    // Debug the conversion process
    if (range.startDate) debugDate('setDateRange input start', range.startDate);
    if (range.endDate) debugDate('setDateRange input end', range.endDate);
    
    // Only update if values actually changed to prevent unnecessary re-renders
    if (localStrings.startDate !== startDate || localStrings.endDate !== endDate) {
      setStartDateState(localStrings.startDate);
      setEndDateState(localStrings.endDate);
      incrementUpdateCount();
    } else {
      console.log('⏭️ setDateRange: No changes, skipping update');
    }
  }, [startDate, endDate, incrementUpdateCount]);

  // Combined setter for both dates
  const setDates = useCallback((newStartDate: string | null, newEndDate: string | null) => {
    console.log('🔄 setDates called:', {
      oldValues: { startDate, endDate },
      newValues: { startDate: newStartDate, endDate: newEndDate },
      source: 'setDates_call',
      stack: new Error().stack?.split('\n').slice(1, 4)
    });
    
    // Only update if values actually changed
    if (newStartDate !== startDate || newEndDate !== endDate) {
      setStartDateState(newStartDate);
      setEndDateState(newEndDate);
      incrementUpdateCount();
    } else {
      console.log('⏭️ setDates: No changes, skipping update');
    }
  }, [startDate, endDate, incrementUpdateCount]);

  // Clear all dates
  const clearDates = useCallback(() => {
    console.log('🗑️ clearDates called:', {
      oldValues: { startDate, endDate },
      source: 'clearDates_call'
    });
    setStartDateState(null);
    setEndDateState(null);
    incrementUpdateCount();
  }, [startDate, endDate, incrementUpdateCount]);

  const contextValue: BookingDatesContextType = useMemo(() => ({
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
    
    // Debug info
    lastUpdateTime,
    updateCount,
  }), [
    startDate,
    endDate,
    dateRange,
    setStartDate,
    setEndDate,
    setDateRange,
    setDates,
    clearDates,
    isDateRangeValid,
    areDatesSelected,
    formattedDateRange,
    lastUpdateTime,
    updateCount,
  ]);

  // Log context value changes (throttled to prevent spam)
  const lastLoggedUpdate = useRef(0);
  useEffect(() => {
    const now = Date.now();
    // Only log every 1 second to prevent spam
    if (now - lastLoggedUpdate.current > 1000) {
      console.log('🏠 BookingDatesContext value updated:', {
        startDate,
        endDate,
        dateRange: {
          startDate: contextValue.dateRange.startDate?.toISOString(),
          endDate: contextValue.dateRange.endDate?.toISOString(),
        },
        isDateRangeValid,
        areDatesSelected,
        updateCount,
        source: 'context_value_change'
      });
      lastLoggedUpdate.current = now;
    }
  }, [startDate, endDate, contextValue.dateRange, isDateRangeValid, areDatesSelected, updateCount]);

  return (
    <BookingDatesContext.Provider value={contextValue}>
      {children}
    </BookingDatesContext.Provider>
  );
};

export const useBookingDatesContext = (): BookingDatesContextType => {
  const context = useContext(BookingDatesContext);
  if (context === undefined) {
    throw new Error('useBookingDatesContext must be used within a BookingDatesProvider');
  }
  return context;
};

// Legacy hook for backward compatibility (now uses context)
export const useBookingDates = (initialStartDate?: string, initialEndDate?: string) => {
  console.warn('⚠️ useBookingDates is deprecated. Use useBookingDatesContext instead. Initial values will be ignored as context manages state globally.');
  return useBookingDatesContext();
};

export default BookingDatesContext;
