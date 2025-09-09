// src/utils/rental-duration-helper.ts
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Type definitions
type DateInput = string | Date | Dayjs;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  duration: number;
}

interface DateRange {
  startDate: DateInput;
  endDate: DateInput;
}

// Load dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Calculate rental duration in days (exclusive)
 * Formula: end.diff(start, 'day') - NO +1
 * Examples:
 * - 2025-09-10 to 2025-09-11 = 1 day rental
 * - 2025-09-10 to 2025-09-12 = 2 days rental
 * - 2025-12-25 to 2025-12-27 = 2 days rental
 */
export function getRentalDays(startDate: DateInput, endDate: DateInput): number {
  try {
    // Convert to dayjs objects
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).startOf('day');
    
    // Validate dates
    if (!start.isValid() || !end.isValid()) {
      console.error('Invalid dates provided to getRentalDays:', { startDate, endDate });
      return 0;
    }
    
    // Check if start date is after end date
    if (start.isAfter(end)) {
      console.error('Start date is after end date:', { startDate, endDate });
      return 0;
    }
    
    // Calculate exclusive duration (no +1)
    // 10-11 Sept = 1 day rental
    const duration = end.diff(start, 'day');
    
    return Math.max(0, duration);
  } catch (error) {
    console.error('Error calculating rental days:', error, { startDate, endDate });
    return 0;
  }
}

/**
 * Format rental duration for display
 */
export function formatRentalDuration(duration: number): string {
  if (duration <= 0) {
    return '0 hari';
  }
  
  if (duration === 1) {
    return '1 hari';
  }
  
  return `${duration} hari`;
}

/**
 * Validate rental dates and return validation result with duration
 */
export function validateRentalDates(startDate: DateInput, endDate: DateInput): ValidationResult {
  const errors = [];
  let duration = 0;
  
  try {
    // Check if dates are provided
    if (!startDate || !endDate) {
      errors.push('Tanggal mulai dan selesai harus diisi');
      return { isValid: false, errors, duration: 0 };
    }
    
    // Convert to dayjs objects
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).startOf('day');
    const today = dayjs().startOf('day');
    
    // Validate date format
    if (!start.isValid()) {
      errors.push('Format tanggal mulai tidak valid');
    }
    
    if (!end.isValid()) {
      errors.push('Format tanggal selesai tidak valid');
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors, duration: 0 };
    }
    
    // Check if start date is in the past (allow today)
    if (start.isBefore(today)) {
      errors.push('Tanggal mulai tidak boleh di masa lampau');
    }
    
    // Check if start date is after end date
    if (start.isAfter(end)) {
      errors.push('Tanggal mulai tidak boleh setelah tanggal selesai');
    }
    
    // Check if start and end date are the same (not allowed - need different dates)
    if (start.isSame(end)) {
      errors.push('Pilih tanggal yang berbeda untuk mulai dan selesai rental');
    }
    
    // Calculate duration if dates are valid
    if (errors.length === 0) {
      duration = getRentalDays(startDate, endDate);
      
      // Duration should be at least 1 day (which means 2 different dates)
      if (duration < 1) {
        errors.push('Durasi rental minimal 1 hari');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      duration
    };
  } catch (error) {
    console.error('Error validating rental dates:', error);
    return {
      isValid: false,
      errors: ['Terjadi kesalahan saat validasi tanggal'],
      duration: 0
    };
  }
}

/**
 * Calculate total rental price
 */
export function calculateRentalPrice(pricePerDay: number, quantity: number, duration: number): number {
  if (pricePerDay <= 0 || quantity <= 0 || duration <= 0) {
    return 0;
  }
  
  return pricePerDay * quantity * duration;
}

/**
 * Format price to Indonesian Rupiah
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get rental duration text for display
 */
export function getRentalDurationText(startDate: DateInput, endDate: DateInput): string {
  const duration = getRentalDays(startDate, endDate);
  return formatRentalDuration(duration);
}

/**
 * Check if two date ranges overlap
 */
export function isDateRangeOverlap(range1: DateRange, range2: DateRange): boolean {
  try {
    const start1 = dayjs(range1.startDate).startOf('day');
    const end1 = dayjs(range1.endDate).startOf('day');
    const start2 = dayjs(range2.startDate).startOf('day');
    const end2 = dayjs(range2.endDate).startOf('day');
    
    if (!start1.isValid() || !end1.isValid() || !start2.isValid() || !end2.isValid()) {
      return false;
    }
    
    // Check if ranges overlap
    return start1.isSameOrBefore(end2) && end1.isSameOrAfter(start2);
  } catch (error) {
    console.error('Error checking date range overlap:', error);
    return false;
  }
}

/**
 * Convert date to API format (YYYY-MM-DD)
 */
export function formatDateForAPI(date: DateInput): string {
  try {
    return dayjs(date).format('YYYY-MM-DD');
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return '';
  }
}

/**
 * Parse date from API format
 */
export function parseDateFromAPI(dateString: string): Date {
  try {
    return dayjs(dateString, 'YYYY-MM-DD').toDate();
  } catch (error) {
    console.error('Error parsing date from API:', error);
    return new Date();
  }
}

// Export default object with all functions
export default {
  getRentalDays,
  formatRentalDuration,
  validateRentalDates,
  calculateRentalPrice,
  formatPrice,
  getRentalDurationText,
  isDateRangeOverlap,
  formatDateForAPI,
  parseDateFromAPI,
};
