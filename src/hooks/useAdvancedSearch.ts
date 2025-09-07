// src/hooks/useAdvancedSearch.ts
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import {
  SearchableItem,
  SearchResult,
  SearchFilters,
  performAdvancedSearch,
  generateAutocompleteSuggestions,
  debounce
} from '../utils/searchUtils';

interface UseAdvancedSearchProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  debounceMs?: number;
  maxSuggestions?: number;
}

interface UseAdvancedSearchReturn {
  // Search state
  query: string;
  filters: SearchFilters;
  isSearching: boolean;
  isLoadingData: boolean;
  
  // Search results
  searchResults: SearchResult[];
  autocompleteSuggestions: SearchResult[];
  totalResults: number;
  
  // Search actions
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearSearch: () => void;
  
  // UI state
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  
  // Error handling
  error: string | null;
}

// Cache for search data
const searchDataCache = {
  data: null as SearchableItem[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes
};

export function useAdvancedSearch({
  initialQuery = '',
  initialFilters = {},
  debounceMs = 300,
  maxSuggestions = 8
}: UseAdvancedSearchProps = {}): UseAdvancedSearchReturn {
  
  const [query, setQueryState] = useState(initialQuery);
  const [filters, setFiltersState] = useState<SearchFilters>(initialFilters);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQueryRef = useRef(query);

  // Fetch searchable data (products + bundlings)
  const { data: searchableData, isLoading: isLoadingData } = useQuery({
    queryKey: ['searchData'],
    queryFn: async (): Promise<SearchableItem[]> => {
      // Check cache first
      const now = Date.now();
      if (searchDataCache.data && (now - searchDataCache.timestamp) < searchDataCache.ttl) {
        return searchDataCache.data;
      }

      try {
        // Fetch products and bundlings in parallel
        const [productsResponse, bundlingsResponse] = await Promise.all([
          axiosInstance.get('/products', {
            params: {
              limit: 1000, // Get all for search
              exclude_rental_includes: true
            }
          }),
          axiosInstance.get('/bundlings', {
            params: {
              limit: 1000 // Get all for search
            }
          })
        ]);

        const products: SearchableItem[] = productsResponse.data.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          type: 'product' as const,
          category: product.category,
          brand: product.brand,
          description: product.description,
          thumbnail: product.photo || product.productPhotos?.[0]?.photo,
          price: product.price
        }));

        const bundlings: SearchableItem[] = bundlingsResponse.data.data.map((bundling: any) => ({
          id: bundling.id,
          name: bundling.name,
          slug: bundling.slug,
          type: 'bundling' as const,
          category: bundling.category,
          brand: bundling.brand,
          description: bundling.description,
          thumbnail: bundling.photo || bundling.bundlingPhotos?.[0]?.photo,
          price: bundling.price
        }));

        const combinedData = [...products, ...bundlings];
        
        // Update cache
        searchDataCache.data = combinedData;
        searchDataCache.timestamp = now;

        return combinedData;
      } catch (error) {
        console.error('Error fetching search data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      debouncedQueryRef.current = searchQuery;
      setIsSearching(false);
    }, debounceMs),
    [debounceMs]
  );

  // Update debounced query when query changes
  useEffect(() => {
    if (query !== debouncedQueryRef.current) {
      setIsSearching(true);
      setError(null);
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  // Perform search when data or debounced query changes
  const searchResults = useMemo(() => {
    if (!searchableData || !debouncedQueryRef.current.trim()) {
      return [];
    }

    try {
      return performAdvancedSearch(
        searchableData,
        debouncedQueryRef.current,
        filters,
        50 // Max results for full search
      );
    } catch (error) {
      setError('Search failed. Please try again.');
      return [];
    }
  }, [searchableData, debouncedQueryRef.current, filters]);

  // Generate autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchableData || !query.trim() || query.length < 2) {
      return [];
    }

    try {
      return generateAutocompleteSuggestions(
        searchableData,
        query,
        maxSuggestions
      );
    } catch (error) {
      return [];
    }
  }, [searchableData, query, maxSuggestions]);

  // Search actions
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    if (newQuery.length >= 2) {
      setShowSuggestions(true);
    }
  }, []);

  const setFilters = useCallback((newFilters: SearchFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setFiltersState({});
    setShowSuggestions(false);
    setError(null);
    debouncedQueryRef.current = '';
  }, []);

  return {
    // Search state
    query,
    filters,
    isSearching: isSearching || isLoadingData,
    isLoadingData,
    
    // Search results
    searchResults,
    autocompleteSuggestions,
    totalResults: searchResults.length,
    
    // Search actions
    setQuery,
    setFilters,
    clearSearch,
    
    // UI state
    showSuggestions,
    setShowSuggestions,
    
    // Error handling
    error
  };
}

// Hook for simple autocomplete (used in navbar)
export function useAutocomplete(query: string, maxSuggestions: number = 6) {
  const { autocompleteSuggestions, isSearching, error } = useAdvancedSearch({
    initialQuery: query,
    maxSuggestions,
    debounceMs: 200
  });

  return {
    suggestions: autocompleteSuggestions,
    isLoading: isSearching,
    error
  };
}
