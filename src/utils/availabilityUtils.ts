// src/utils/availabilityUtils.ts
import { Product, Bundling, BundlingProduct } from '../types/type';

/**
 * Check if a single product is available based on the new rules:
 * - available_quantity > 0
 * - is_available === true
 * - Ignore status and quantity as availability indicators
 */
export function isProductAvailable(product: Product | BundlingProduct): boolean {
  // Use available_quantity and is_available as the authoritative fields
  const availableQuantity = product.available_quantity ?? 0;
  const isAvailable = product.is_available ?? true; // Default to true if not specified
  
  return availableQuantity > 0 && isAvailable;
}

/**
 * Get available quantity for a single product
 * Returns 0 if product is not available
 */
export function getProductAvailableQuantity(product: Product | BundlingProduct): number {
  if (!isProductAvailable(product)) {
    return 0;
  }
  return product.available_quantity ?? 0;
}

/**
 * Calculate bundling availability based on minimum available_quantity of all products
 * Bundling is available only if ALL products are available and minimum available_quantity > 0
 */
export function isBundlingAvailable(bundling: Bundling): boolean {
  if (!bundling.products || bundling.products.length === 0) {
    return false;
  }

  // Check if all products are available
  const allProductsAvailable = bundling.products.every(product => isProductAvailable(product));
  if (!allProductsAvailable) {
    return false;
  }

  // Get minimum available quantity
  const minAvailableQuantity = getBundlingAvailableQuantity(bundling);
  return minAvailableQuantity > 0;
}

/**
 * Get bundling available quantity (minimum available_quantity from all products)
 * Returns 0 if any product is not available
 */
export function getBundlingAvailableQuantity(bundling: Bundling): number {
  if (!bundling.products || bundling.products.length === 0) {
    return 0;
  }

  // Check if all products are available first
  const availableProducts = bundling.products.filter(product => isProductAvailable(product));
  if (availableProducts.length !== bundling.products.length) {
    return 0; // Some products are not available
  }

  // Calculate minimum available quantity
  const availableQuantities = bundling.products.map(product => 
    getProductAvailableQuantity(product)
  );

  return Math.min(...availableQuantities);
}

/**
 * Get availability status text for products
 */
export function getProductAvailabilityText(product: Product | BundlingProduct): {
  text: string;
  isAvailable: boolean;
  quantity: number;
} {
  const available = isProductAvailable(product);
  const quantity = getProductAvailableQuantity(product);
  
  if (available && quantity > 0) {
    return {
      text: `Tersedia (${quantity} unit)`,
      isAvailable: true,
      quantity
    };
  } else {
    return {
      text: 'Tidak tersedia',
      isAvailable: false,
      quantity: 0
    };
  }
}

/**
 * Get availability status text for bundling
 */
export function getBundlingAvailabilityText(bundling: Bundling): {
  text: string;
  isAvailable: boolean;
  quantity: number;
} {
  const available = isBundlingAvailable(bundling);
  const quantity = getBundlingAvailableQuantity(bundling);
  
  if (available && quantity > 0) {
    return {
      text: `Tersedia (${quantity} paket)`,
      isAvailable: true,
      quantity
    };
  } else {
    return {
      text: 'Tidak tersedia',
      isAvailable: false,
      quantity: 0
    };
  }
}

/**
 * Check if product/bundling should show booking button
 */
export function canBook(item: Product | Bundling): boolean {
  if ('products' in item) {
    // It's a bundling
    return isBundlingAvailable(item);
  } else {
    // It's a product
    return isProductAvailable(item);
  }
}

/**
 * Apply availability filter to products array
 */
export function filterProductsByAvailability(
  products: Product[], 
  availableOnly: boolean = false
): Product[] {
  if (!availableOnly) {
    return products;
  }
  
  return products.filter(product => isProductAvailable(product));
}

/**
 * Apply availability filter to bundling array
 */
export function filterBundlingByAvailability(
  bundlings: Bundling[], 
  availableOnly: boolean = false
): Bundling[] {
  if (!availableOnly) {
    return bundlings;
  }
  
  return bundlings.filter(bundling => isBundlingAvailable(bundling));
}

/**
 * Sort products by availability (available first, then by quantity desc)
 */
export function sortProductsByAvailability(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aAvailable = isProductAvailable(a);
    const bAvailable = isProductAvailable(b);
    
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    
    // Both have same availability status, sort by quantity
    const aQuantity = getProductAvailableQuantity(a);
    const bQuantity = getProductAvailableQuantity(b);
    
    return bQuantity - aQuantity; // Higher quantity first
  });
}

/**
 * Sort bundling by availability (available first, then by quantity desc)
 */
export function sortBundlingByAvailability(bundlings: Bundling[]): Bundling[] {
  return [...bundlings].sort((a, b) => {
    const aAvailable = isBundlingAvailable(a);
    const bAvailable = isBundlingAvailable(b);
    
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    
    // Both have same availability status, sort by quantity
    const aQuantity = getBundlingAvailableQuantity(a);
    const bQuantity = getBundlingAvailableQuantity(b);
    
    return bQuantity - aQuantity; // Higher quantity first
  });
}

/**
 * Debug availability information
 */
export function debugAvailability(item: Product | Bundling, label?: string): void {
  const prefix = label ? `[${label}]` : '';
  
  if ('products' in item) {
    // It's a bundling
    console.log(`${prefix} Bundling "${item.name}" availability:`, {
      available: isBundlingAvailable(item),
      availableQuantity: getBundlingAvailableQuantity(item),
      products: item.products.map(p => ({
        name: p.name,
        available_quantity: p.available_quantity,
        is_available: p.is_available,
        isAvailable: isProductAvailable(p)
      }))
    });
  } else {
    // It's a product
    console.log(`${prefix} Product "${item.name}" availability:`, {
      available: isProductAvailable(item),
      availableQuantity: getProductAvailableQuantity(item),
      available_quantity: item.available_quantity,
      is_available: item.is_available,
      status: item.status
    });
  }
}
