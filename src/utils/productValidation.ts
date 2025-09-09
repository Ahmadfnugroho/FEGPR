// src/utils/productValidation.ts
import { Product, ProductPhoto } from '../types/type';
import { 
  ValidatedProduct, 
  ValidatedProductPhoto, 
  ProductValidationResult, 
  DataIntegrityResult 
} from '../types/apiTypes';
import { STORAGE_BASE_URL } from '../api/constants';

/**
 * Debug logging utility
 */
const debugLog = {
  validation: (message: string, data?: any) => {
    console.log(`🔍 [Product Validation] ${message}`, data);
  },
  warning: (message: string, data?: any) => {
    console.warn(`⚠️ [Product Validation] ${message}`, data);
  },
  error: (message: string, data?: any) => {
    console.error(`❌ [Product Validation] ${message}`, data);
  },
  reset: (message: string, data?: any) => {
    console.log(`🔄 [State Reset] ${message}`, data);
  }
};

/**
 * Check if a product photo URL is valid
 */
export const validateProductPhotoUrl = async (photoPath: string): Promise<boolean> => {
  if (!photoPath) return false;
  
  try {
    const fullUrl = photoPath.startsWith('http') ? photoPath : `${STORAGE_BASE_URL}/${photoPath}`;
    
    // Simple check - try to create an image element and load it
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = fullUrl;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  } catch (error) {
    debugLog.error('Error validating photo URL:', { photoPath, error });
    return false;
  }
};

/**
 * Validate a single product photo
 */
export const validateProductPhoto = async (photo: ProductPhoto): Promise<ValidatedProductPhoto> => {
  if (!photo || typeof photo !== 'object') {
    return {
      id: 0,
      photo: '',
      isValid: false,
      errorReason: 'Invalid photo object'
    };
  }

  const { id, photo: photoPath } = photo;
  
  if (!photoPath || typeof photoPath !== 'string') {
    return {
      id: id || 0,
      photo: photoPath || '',
      isValid: false,
      errorReason: 'Missing or invalid photo path'
    };
  }

  const fullUrl = photoPath.startsWith('http') ? photoPath : `${STORAGE_BASE_URL}/${photoPath}`;
  const isValid = await validateProductPhotoUrl(photoPath);
  
  return {
    id,
    photo: photoPath,
    isValid,
    fullUrl,
    errorReason: isValid ? undefined : 'Photo URL is not accessible'
  };
};

/**
 * Validate all photos in a product
 */
export const validateProductPhotos = async (photos: ProductPhoto[]): Promise<ValidatedProductPhoto[]> => {
  if (!Array.isArray(photos)) {
    debugLog.warning('Product photos is not an array:', photos);
    return [];
  }

  if (photos.length === 0) {
    debugLog.validation('No product photos to validate');
    return [];
  }

  debugLog.validation(`Validating ${photos.length} product photos`);
  
  try {
    const validatedPhotos = await Promise.all(
      photos.map(photo => validateProductPhoto(photo))
    );
    
    const validCount = validatedPhotos.filter(p => p.isValid).length;
    debugLog.validation(`Photo validation complete: ${validCount}/${photos.length} valid`);
    
    return validatedPhotos;
  } catch (error) {
    debugLog.error('Error validating product photos:', error);
    return photos.map(photo => ({
      id: photo.id,
      photo: photo.photo,
      isValid: false,
      errorReason: 'Validation error occurred'
    }));
  }
};

/**
 * Get valid photo URLs for a product
 */
export const getValidProductPhotoUrls = (product: Product): string[] => {
  if (!product?.productPhotos || !Array.isArray(product.productPhotos)) {
    debugLog.warning('Product has no photos or invalid photo array:', product);
    return [];
  }

  const validPhotos = product.productPhotos
    .filter(photo => photo && photo.photo && typeof photo.photo === 'string')
    .map(photo => photo.photo.startsWith('http') ? photo.photo : `${STORAGE_BASE_URL}/${photo.photo}`);

  if (validPhotos.length === 0) {
    debugLog.validation('No valid photos found for product:', product.name);
  }

  return validPhotos;
};

/**
 * Check if product has valid photos
 */
export const hasValidProductPhotos = (product: Product): boolean => {
  return getValidProductPhotoUrls(product).length > 0;
};

/**
 * Validate a complete product object
 */
export const validateProduct = (product: Product): ProductValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!product) {
    errors.push('Product object is null or undefined');
    return {
      isValid: false,
      hasValidPhotos: false,
      validPhotoCount: 0,
      invalidPhotoCount: 0,
      errors,
      warnings
    };
  }

  if (!product.id) errors.push('Product ID is missing');
  if (!product.name || typeof product.name !== 'string') errors.push('Product name is missing or invalid');
  if (!product.slug || typeof product.slug !== 'string') errors.push('Product slug is missing or invalid');
  if (typeof product.price !== 'number' || product.price < 0) errors.push('Product price is missing or invalid');

  // Check photos
  const validPhotoUrls = getValidProductPhotoUrls(product);
  const totalPhotos = product.productPhotos?.length || 0;
  const validPhotoCount = validPhotoUrls.length;
  const invalidPhotoCount = totalPhotos - validPhotoCount;

  if (totalPhotos === 0) {
    warnings.push('Product has no photos');
  } else if (validPhotoCount === 0) {
    errors.push('Product has photos but none are valid');
  } else if (invalidPhotoCount > 0) {
    warnings.push(`Product has ${invalidPhotoCount} invalid photos out of ${totalPhotos}`);
  }

  // Check availability fields
  if (product.available_quantity !== undefined && typeof product.available_quantity !== 'number') {
    warnings.push('Available quantity is not a number');
  }

  if (product.is_available !== undefined && typeof product.is_available !== 'boolean') {
    warnings.push('is_available is not a boolean');
  }

  const isValid = errors.length === 0;
  const hasValidPhotos = validPhotoCount > 0;

  debugLog.validation('Product validation complete:', {
    productName: product.name,
    isValid,
    hasValidPhotos,
    validPhotoCount,
    invalidPhotoCount,
    errors: errors.length,
    warnings: warnings.length
  });

  return {
    isValid,
    hasValidPhotos,
    validPhotoCount,
    invalidPhotoCount,
    errors,
    warnings
  };
};

/**
 * Create a validated product with photo validation
 */
export const createValidatedProduct = async (product: Product): Promise<ValidatedProduct> => {
  const validatedPhotos = await validateProductPhotos(product.productPhotos || []);
  const validPhotoCount = validatedPhotos.filter(p => p.isValid).length;
  
  return {
    ...product,
    productPhotos: validatedPhotos,
    hasValidPhotos: validPhotoCount > 0,
    validPhotoCount
  };
};

/**
 * Reset product state when API returns empty or invalid data
 */
export const resetProductState = <T extends { products?: Product[]; [key: string]: any }>(
  currentState: T,
  reason: string = 'API returned empty data'
): T => {
  debugLog.reset(`Resetting product state - ${reason}`, {
    previousProductCount: currentState.products?.length || 0
  });

  return {
    ...currentState,
    products: [],
    // Reset any related state
    hasMore: false,
    page: 1,
    totalPages: 0,
    error: null
  };
};

/**
 * Check data integrity of product array
 */
export const checkProductArrayIntegrity = (products: Product[]): DataIntegrityResult => {
  const missingFields: string[] = [];
  const invalidFields: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(products)) {
    return {
      isValid: false,
      missingFields: ['products array'],
      invalidFields: ['products is not an array'],
      warnings: [],
      severity: 'high'
    };
  }

  if (products.length === 0) {
    warnings.push('Product array is empty');
    return {
      isValid: true,
      missingFields: [],
      invalidFields: [],
      warnings,
      severity: 'low'
    };
  }

  // Check each product
  products.forEach((product, index) => {
    const validation = validateProduct(product);
    
    if (!validation.isValid) {
      invalidFields.push(`Product at index ${index}: ${validation.errors.join(', ')}`);
    }
    
    if (validation.warnings.length > 0) {
      warnings.push(`Product at index ${index}: ${validation.warnings.join(', ')}`);
    }
  });

  const isValid = invalidFields.length === 0;
  const severity: 'low' | 'medium' | 'high' = 
    invalidFields.length > products.length * 0.5 ? 'high' :
    invalidFields.length > 0 ? 'medium' : 'low';

  debugLog.validation('Product array integrity check:', {
    totalProducts: products.length,
    isValid,
    missingFields: missingFields.length,
    invalidFields: invalidFields.length,
    warnings: warnings.length,
    severity
  });

  return {
    isValid,
    missingFields,
    invalidFields,
    warnings,
    severity
  };
};

/**
 * Filter out invalid products from an array
 */
export const filterValidProducts = (products: Product[]): Product[] => {
  if (!Array.isArray(products)) {
    debugLog.error('Cannot filter products: input is not an array', products);
    return [];
  }

  const validProducts = products.filter(product => {
    const validation = validateProduct(product);
    return validation.isValid;
  });

  if (validProducts.length !== products.length) {
    debugLog.warning(`Filtered out ${products.length - validProducts.length} invalid products`);
  }

  return validProducts;
};

/**
 * Clear component state related to photos
 */
export const clearPhotoState = () => {
  debugLog.reset('Clearing photo-related state');
  
  // Clear any cached image elements
  const imageElements = document.querySelectorAll('img[src*="productPhotos"]');
  imageElements.forEach(img => {
    if (img instanceof HTMLImageElement) {
      img.src = '';
      img.removeAttribute('src');
    }
  });

  // Clear any photo-related local storage if exists
  try {
    const photoKeys = Object.keys(localStorage).filter(key => key.includes('productPhoto'));
    photoKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    // Ignore localStorage errors
  }
};

/**
 * Sanitize product data by removing/fixing invalid fields
 */
export const sanitizeProduct = (product: Product): Product => {
  if (!product) return product;

  const sanitized = { ...product };

  // Ensure numeric fields are numbers
  if (typeof sanitized.price === 'string') {
    sanitized.price = parseFloat(sanitized.price) || 0;
  }
  if (typeof sanitized.quantity === 'string') {
    sanitized.quantity = parseInt(sanitized.quantity, 10) || 0;
  }
  if (typeof sanitized.available_quantity === 'string') {
    sanitized.available_quantity = parseInt(sanitized.available_quantity, 10) || 0;
  }

  // Ensure boolean fields are booleans
  if (typeof sanitized.is_available === 'string') {
    sanitized.is_available = sanitized.is_available === 'true' || sanitized.is_available === '1';
  }

  // Ensure arrays are arrays
  if (!Array.isArray(sanitized.productPhotos)) {
    sanitized.productPhotos = [];
  }
  if (!Array.isArray(sanitized.productSpecifications)) {
    sanitized.productSpecifications = [];
  }
  if (!Array.isArray(sanitized.rentalIncludes)) {
    sanitized.rentalIncludes = [];
  }

  return sanitized;
};

export default {
  validateProductPhotoUrl,
  validateProductPhoto,
  validateProductPhotos,
  getValidProductPhotoUrls,
  hasValidProductPhotos,
  validateProduct,
  createValidatedProduct,
  resetProductState,
  checkProductArrayIntegrity,
  filterValidProducts,
  clearPhotoState,
  sanitizeProduct
};
