// src/api/availabilityApi.ts
import axiosInstance from './axiosInstance';
import { formatDateForAPI } from '../utils/rental-duration-helper';

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
  
  const formattedStartDate = formatDateForAPI(startDate);
  const formattedEndDate = formatDateForAPI(endDate);
  
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
  
  const formattedStartDate = formatDateForAPI(startDate);
  const formattedEndDate = formatDateForAPI(endDate);
  
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
    params.start_date = formatDateForAPI(startDate);
    params.end_date = formatDateForAPI(endDate);
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
    params.start_date = formatDateForAPI(startDate);
    params.end_date = formatDateForAPI(endDate);
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
