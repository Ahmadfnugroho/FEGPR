// src/utils/searchUtils.ts
export interface SearchableItem {
  id: number;
  name: string;
  slug: string;
  type: 'product' | 'bundling';
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  description?: string;
  thumbnail?: string;
  price?: number;
}

export interface SearchResult extends SearchableItem {
  score: number;
  matchedFields: string[];
  url: string;
  display: string;
}

export interface SearchFilters {
  category?: string[];
  brand?: string[];
  priceRange?: [number, number];
  type?: ('product' | 'bundling')[];
}

/**
 * Calculate Levenshtein distance for fuzzy matching (typo tolerance)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 */
function fuzzyMatchScore(query: string, text: string): number {
  const queryLower = query.toLowerCase().trim();
  const textLower = text.toLowerCase().trim();

  // Exact match
  if (queryLower === textLower) return 1.0;

  // Contains match
  if (textLower.includes(queryLower)) {
    const ratio = queryLower.length / textLower.length;
    return 0.8 * ratio;
  }

  // Fuzzy match with Levenshtein distance
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  
  if (distance <= 2) { // Allow up to 2 typos
    return Math.max(0, (maxLength - distance) / maxLength) * 0.6;
  }

  // Word-level fuzzy match
  const queryWords = queryLower.split(' ');
  const textWords = textLower.split(' ');
  
  let wordMatches = 0;
  let totalScore = 0;

  queryWords.forEach(qWord => {
    let bestWordScore = 0;
    textWords.forEach(tWord => {
      if (tWord.includes(qWord) || qWord.includes(tWord)) {
        bestWordScore = Math.max(bestWordScore, 0.7);
      } else {
        const wordDistance = levenshteinDistance(qWord, tWord);
        if (wordDistance <= 1 && qWord.length >= 3) {
          bestWordScore = Math.max(bestWordScore, 0.5);
        }
      }
    });
    
    if (bestWordScore > 0) {
      wordMatches++;
      totalScore += bestWordScore;
    }
  });

  return wordMatches > 0 ? (totalScore / queryWords.length) * 0.4 : 0;
}

/**
 * Enhanced search with weighted scoring system
 */
export function performAdvancedSearch(
  items: SearchableItem[],
  query: string,
  filters: SearchFilters = {},
  limit: number = 20
): SearchResult[] {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  items.forEach(item => {
    let score = 0;
    const matchedFields: string[] = [];

    // 1. Name matching (highest weight: 40%)
    const nameScore = fuzzyMatchScore(query, item.name);
    if (nameScore > 0) {
      score += nameScore * 4.0;
      matchedFields.push('name');
    }

    // 2. Category matching (weight: 25%)
    if (item.category?.name) {
      const categoryScore = fuzzyMatchScore(query, item.category.name);
      if (categoryScore > 0) {
        score += categoryScore * 2.5;
        matchedFields.push('category');
      }
    }

    // 3. Brand matching (weight: 25%)
    if (item.brand?.name) {
      const brandScore = fuzzyMatchScore(query, item.brand.name);
      if (brandScore > 0) {
        score += brandScore * 2.5;
        matchedFields.push('brand');
      }
    }

    // 4. Description matching (weight: 10%)
    if (item.description) {
      const descScore = fuzzyMatchScore(query, item.description);
      if (descScore > 0) {
        score += descScore * 1.0;
        matchedFields.push('description');
      }
    }

    // Apply filters
    if (score > 0) {
      let passesFilter = true;

      // Category filter
      if (filters.category && filters.category.length > 0) {
        passesFilter = passesFilter && !!(item.category && 
          filters.category.includes(item.category.slug));
      }

      // Brand filter
      if (filters.brand && filters.brand.length > 0) {
        passesFilter = passesFilter && !!(item.brand && 
          filters.brand.includes(item.brand.slug));
      }

      // Type filter
      if (filters.type && filters.type.length > 0) {
        passesFilter = passesFilter && filters.type.includes(item.type);
      }

      // Price range filter
      if (filters.priceRange && item.price) {
        const [minPrice, maxPrice] = filters.priceRange;
        passesFilter = passesFilter && item.price >= minPrice && item.price <= maxPrice;
      }

      if (passesFilter && score >= 0.1) { // Minimum threshold
        // Generate URL and display text
        const url = item.type === 'product' 
          ? `/product/${item.slug}` 
          : `/bundling/${item.slug}`;

        const display = item.type === 'bundling' 
          ? `📦 ${item.name}` 
          : item.name;

        results.push({
          ...item,
          score,
          matchedFields,
          url,
          display
        });
      }
    }
  });

  // Sort by score (descending) and return limited results
  return results
    .sort((a, b) => {
      // Primary sort: score
      if (Math.abs(a.score - b.score) > 0.01) {
        return b.score - a.score;
      }
      // Secondary sort: prefer exact name matches
      const aNameExact = a.name.toLowerCase() === queryLower ? 1 : 0;
      const bNameExact = b.name.toLowerCase() === queryLower ? 1 : 0;
      if (aNameExact !== bNameExact) {
        return bNameExact - aNameExact;
      }
      // Tertiary sort: prefer products over bundlings
      if (a.type !== b.type) {
        return a.type === 'product' ? -1 : 1;
      }
      // Final sort: alphabetical
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

/**
 * Generate autocomplete suggestions with semantic grouping
 */
export function generateAutocompleteSuggestions(
  items: SearchableItem[],
  query: string,
  maxSuggestions: number = 8
): SearchResult[] {
  if (!query.trim() || query.length < 2) return [];

  const suggestions = performAdvancedSearch(items, query, {}, maxSuggestions * 2);
  
  // Group and limit suggestions
  const productSuggestions = suggestions
    .filter(item => item.type === 'product')
    .slice(0, Math.ceil(maxSuggestions * 0.6));
    
  const bundlingSuggestions = suggestions
    .filter(item => item.type === 'bundling')
    .slice(0, Math.floor(maxSuggestions * 0.4));

  return [...productSuggestions, ...bundlingSuggestions]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
}

/**
 * Extract search keywords from query for highlighting
 */
export function extractSearchKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length >= 2);
}

/**
 * Highlight matched terms in text
 */
export function highlightMatches(text: string, query: string): string {
  const keywords = extractSearchKeywords(query);
  let highlightedText = text;

  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  });

  return highlightedText;
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
