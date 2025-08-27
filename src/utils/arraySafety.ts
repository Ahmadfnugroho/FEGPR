/**
 * Array Safety Utilities
 * Comprehensive utilities to prevent array-related errors
 */

/**
 * Safely ensures a value is an array
 */
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

/**
 * Safely gets array length
 */
export function safeLength(value: unknown): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  return 0;
}

/**
 * Safely maps over an array
 */
export function safeMap<T, R>(
  value: unknown,
  mapFn: (item: T, index: number) => R
): R[] {
  if (Array.isArray(value)) {
    return value.map(mapFn);
  }
  return [];
}

/**
 * Safely filters an array
 */
export function safeFilter<T>(
  value: unknown,
  filterFn: (item: T, index: number) => boolean
): T[] {
  if (Array.isArray(value)) {
    return value.filter(filterFn);
  }
  return [];
}

/**
 * Safely executes forEach on an array
 */
export function safeForEach<T>(
  value: unknown,
  forEachFn: (item: T, index: number) => void
): void {
  if (Array.isArray(value)) {
    value.forEach(forEachFn);
  }
}

/**
 * Safely checks if array includes a value
 */
export function safeIncludes<T>(value: unknown, searchItem: T): boolean {
  if (Array.isArray(value)) {
    return value.includes(searchItem);
  }
  return false;
}

/**
 * Safely finds an item in an array
 */
export function safeFind<T>(
  value: unknown,
  findFn: (item: T, index: number) => boolean
): T | undefined {
  if (Array.isArray(value)) {
    return value.find(findFn);
  }
  return undefined;
}

/**
 * Default empty array constant to prevent recreating empty arrays
 */
export const EMPTY_ARRAY: readonly never[] = Object.freeze([]);
