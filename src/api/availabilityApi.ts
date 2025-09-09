// src/api/availabilityApi.ts
import axiosInstance from './axiosInstance';
import { localDateToUTC } from '../utils/dateUtils';

export interface AvailabilityParams {
  slug: string;
  startDate: string | Date;
  endDate: string | Date;
}

export interface AvailabilityResponse {
  available: boolean;
  available_quantity: number;
  total_quantity: number;
  conflicting_transactions?: any[];
}

/**
 * Check product availability for specific date range
 */
export const checkProductAvailability = async (params: AvailabilityParams): Promise<AvailabilityResponse> => {
  const { slug, startDate, endDate } = params;
  
  // Convert local date strings to UTC for API
  const startDateStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
  const endDateStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
  
  const formattedStartDate = localDateToUTC(startDateStr)?.split('T')[0] || startDateStr;
  const formattedEndDate = localDateToUTC(endDateStr)?.split('T')[0] || endDateStr;
  
  try {
    const response = await axiosInstance.get(`/product/${slug}`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        check_availability: true
      }
    });
    
    return {
      available: response.data.data.available_quantity > 0,
      available_quantity: response.data.data.available_quantity || 0,
      total_quantity: response.data.data.total_quantity || 0,
      conflicting_transactions: response.data.data.conflicting_transactions || []
    };
  } catch (error) {
    console.error('Error checking product availability:', error);
    throw new Error('Gagal memeriksa ketersediaan produk');
  }
};

/**
 * Check bundling availability for specific date range
 */
export const checkBundlingAvailability = async (params: AvailabilityParams): Promise<AvailabilityResponse> => {
  const { slug, startDate, endDate } = params;
  
  // Convert local date strings to UTC for API
  const startDateStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
  const endDateStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
  
  const formattedStartDate = localDateToUTC(startDateStr)?.split('T')[0] || startDateStr;
  const formattedEndDate = localDateToUTC(endDateStr)?.split('T')[0] || endDateStr;
  
  try {
    const response = await axiosInstance.get(`/bundling/${slug}`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        check_availability: true
      }
    });
    
    return {
      available: response.data.data.available,
      available_quantity: response.data.data.available_quantity || 0,
      total_quantity: response.data.data.total_quantity || 0,
      conflicting_transactions: response.data.data.conflicting_transactions || []
    };
  } catch (error) {
    console.error('Error checking bundling availability:', error);
    throw new Error('Gagal memeriksa ketersediaan bundling');
  }
};

/**
 * Generic availability checker
 */
export const checkAvailability = async (
  type: 'product' | 'bundling',
  params: AvailabilityParams
): Promise<AvailabilityResponse> => {
  if (type === 'product') {
    return checkProductAvailability(params);
  } else {
    return checkBundlingAvailability(params);
  }
};

/**
 * Get product details with availability for date range
 */
export const getProductWithAvailability = async (
  slug: string, 
  startDate?: string | Date, 
  endDate?: string | Date
) => {
  const params: any = {};
  
  if (startDate && endDate) {
    // Convert local date strings to UTC for API
    const startDateStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const endDateStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
    
    params.start_date = localDateToUTC(startDateStr)?.split('T')[0] || startDateStr;
    params.end_date = localDateToUTC(endDateStr)?.split('T')[0] || endDateStr;
  }
  
  try {
    const response = await axiosInstance.get(`/product/${slug}`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Gagal mengambil data produk');
  }
};

/**
 * Get bundling details with availability for date range
 */
export const getBundlingWithAvailability = async (
  slug: string, 
  startDate?: string | Date, 
  endDate?: string | Date
) => {
  const params: any = {};
  
  if (startDate && endDate) {
    // Convert local date strings to UTC for API
    const startDateStr = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const endDateStr = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
    
    params.start_date = localDateToUTC(startDateStr)?.split('T')[0] || startDateStr;
    params.end_date = localDateToUTC(endDateStr)?.split('T')[0] || endDateStr;
  }
  
  try {
    const response = await axiosInstance.get(`/bundling/${slug}`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching bundling:', error);
    throw new Error('Gagal mengambil data bundling');
  }
};

export default {
  checkProductAvailability,
  checkBundlingAvailability,
  checkAvailability,
  getProductWithAvailability,
  getBundlingWithAvailability,
};
