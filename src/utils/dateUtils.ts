// src/utils/dateUtils.ts
/**
 * Timezone-safe date utilities for booking system
 * 
 * Key principles:
 * 1. All UI dates are handled in local timezone
 * 2. Context and localStorage store local date strings (YYYY-MM-DD)
 * 3. API calls convert to UTC only when needed
 * 4. No automatic timezone conversions that shift dates
 */

/**
 * Creates a Date object in local timezone for a specific date
 * This prevents timezone shifts that occur with Date constructor
 * 
 * @param year - Full year (e.g., 2024)
 * @param month - Month (0-based, 0 = January)
 * @param day - Day of month (1-31)
 * @returns Date object representing the date in local timezone
 */
export function createLocalDate(year: number, month: number, day: number): Date {
  const date = new Date();
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0); // Set to start of day in local timezone
  return date;
}

/**
 * Converts a Date object to local date string (YYYY-MM-DD)
 * Uses local timezone methods to avoid UTC conversion
 * 
 * @param date - Date object to convert
 * @returns Local date string in YYYY-MM-DD format
 */
export function dateToLocalString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts a local date string (YYYY-MM-DD) to Date object
 * Creates the date in local timezone without timezone shifts
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone or null if invalid
 */
export function localStringToDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  // Parse YYYY-MM-DD format manually to avoid timezone issues
  const dateParts = dateString.split('-');
  if (dateParts.length !== 3) {
    console.warn('Invalid date format:', dateString);
    return null;
  }

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is 0-based
  const day = parseInt(dateParts[2], 10);

  // Validate parsed values
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.warn('Invalid date components:', { year, month: month + 1, day });
    return null;
  }

  // Create date in local timezone
  return createLocalDate(year, month, day);
}

/**
 * Gets today's date as a local date string (YYYY-MM-DD)
 * 
 * @returns Today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayLocalString(): string {
  return dateToLocalString(new Date());
}

/**
 * Checks if a date string is valid and represents a real date
 * 
 * @param dateString - Date string to validate
 * @returns True if valid date string
 */
export function isValidDateString(dateString: string | null): boolean {
  if (!dateString) return false;
  const date = localStringToDate(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Converts local date to UTC ISO string for API calls
 * This is the ONLY function that should convert to UTC
 * 
 * @param localDateString - Local date string (YYYY-MM-DD)
 * @returns UTC ISO string or null if invalid
 */
export function localDateToUTC(localDateString: string): string | null {
  const localDate = localStringToDate(localDateString);
  if (!localDate) return null;
  
  // Create UTC date with same date components
  const utcDate = new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate(),
    0, 0, 0, 0
  ));
  
  return utcDate.toISOString();
}

/**
 * Creates a date range object for DateRangePicker from local date strings
 * 
 * @param startDate - Start date string (YYYY-MM-DD) or null
 * @param endDate - End date string (YYYY-MM-DD) or null
 * @returns DateRange object with Date objects or null values
 */
export function createDateRangeFromStrings(
  startDate: string | null, 
  endDate: string | null
): { startDate: Date | null; endDate: Date | null } {
  return {
    startDate: startDate ? localStringToDate(startDate) : null,
    endDate: endDate ? localStringToDate(endDate) : null,
  };
}

/**
 * Converts DateRange object to local date strings
 * 
 * @param range - DateRange with Date objects
 * @returns Object with local date strings
 */
export function dateRangeToLocalStrings(
  range: { startDate: Date | null; endDate: Date | null }
): { startDate: string | null; endDate: string | null } {
  return {
    startDate: range.startDate ? dateToLocalString(range.startDate) : null,
    endDate: range.endDate ? dateToLocalString(range.endDate) : null,
  };
}

/**
 * Compares two dates for equality (ignoring time)
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates represent the same day
 */
export function isSameDate(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return date1 === date2;
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Formats a date for display in Indonesian locale
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDateLocal(
  date: Date | null, 
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
): string {
  if (!date) return '';
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Debug helper: logs date with timezone information
 * 
 * @param label - Debug label
 * @param date - Date to debug
 */
export function debugDate(label: string, date: Date | string | null): void {
  if (!date) {
    console.log(`🕐 ${label}:`, null);
    return;
  }

  if (typeof date === 'string') {
    const parsedDate = localStringToDate(date);
    console.log(`🕐 ${label}:`, {
      dateString: date,
      parsedDate: parsedDate?.toString(),
      localDate: parsedDate ? dateToLocalString(parsedDate) : null,
    });
  } else {
    console.log(`🕐 ${label}:`, {
      dateObject: date.toString(),
      localString: dateToLocalString(date),
      isoString: date.toISOString(),
      timezone: date.getTimezoneOffset(),
    });
  }
}
