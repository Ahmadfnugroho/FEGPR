// src/components/BundlingSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, QueueListIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { STORAGE_BASE_URL } from '../api/constants';
import { Bundling } from '../types/type';
import { isBundlingAvailable, getBundlingAvailabilityText } from '../utils/availabilityUtils';
import { localDateToUTC } from '../utils/dateUtils';

interface BundlingSuggestion {
  id: number;
  name: string;
  slug: string;
  price: number;
  bundlingPhotos?: Array<{ photo: string }>;
  products?: Array<{
    id: number;
    available_quantity?: number;
    is_available?: boolean;
  }>;
}

interface BundlingSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  resultsCount?: number;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  startDate?: string;
  endDate?: string;
  onSuggestionSelect?: (bundling: BundlingSuggestion) => void;
}

export default function BundlingSearch({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Cari bundling...",
  className = "",
  resultsCount,
  showSuggestions = true,
  maxSuggestions = 6,
  startDate,
  endDate,
  onSuggestionSelect
}: BundlingSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<BundlingSuggestion[]>([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch bundling suggestions with availability
  useEffect(() => {
    if (!showSuggestions || value.length < 2) {
      setSuggestions([]);
      setShowSuggestionDropdown(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        
        const params: any = {
          q: value,
          limit: maxSuggestions
        };
        
        // Include date range if provided for availability check
        if (startDate && endDate) {
          // Convert local date strings to UTC for API
          params.start_date = localDateToUTC(startDate)?.split('T')[0] || startDate;
          params.end_date = localDateToUTC(endDate)?.split('T')[0] || endDate;
        }
        
        const response = await axiosInstance.get('/bundlings', { params });
        
        if (response.data.data) {
          setSuggestions(response.data.data);
          setShowSuggestionDropdown(true);
        }
      } catch (error) {
        console.error('Error fetching bundling suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [value, maxSuggestions, startDate, endDate, showSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestionDropdown(false);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
    setSuggestions([]);
    setShowSuggestionDropdown(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: BundlingSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      // Default behavior - navigate to bundling page
      navigate(`/bundling/${suggestion.slug}`);
    }
    setShowSuggestionDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white border rounded-xl transition-all duration-200 shadow-sm
          ${isFocused 
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
        `}>
          {/* Bundling Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            {loadingSuggestions ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            ) : (
              <QueueListIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (showSuggestions && e.target.value.length > 0) {
                setIsFocused(true);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              if (showSuggestions && value.length >= 2 && suggestions.length > 0) {
                setShowSuggestionDropdown(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-16 py-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base font-medium"
          />

          {/* Search Stats */}
          {resultsCount !== undefined && value && !showSuggestionDropdown && (
            <div className="absolute right-16 text-sm text-gray-500">
              {resultsCount} hasil
            </div>
          )}

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className={`
              absolute right-2 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
              ${value.trim() 
                ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                : 'text-gray-400'
              }
            `}
            aria-label="Search bundling"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto"
        >
          {suggestions.map((suggestion) => {
            // Cast to bundling for availability calculation
            const bundling = suggestion as unknown as Bundling;
            const availabilityInfo = getBundlingAvailabilityText(bundling);
            const mainImage = suggestion.bundlingPhotos?.[0]?.photo;
            
            return (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-5 py-4 hover:bg-blue-50 flex items-center gap-4 text-sm border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:shadow-sm"
              >
                {/* Bundling Image */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden flex-shrink-0">
                  {mainImage ? (
                    <img
                      src={`${STORAGE_BASE_URL}/${mainImage}`}
                      alt={suggestion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48x48/dbeafe/3b82f6?text=📦';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600">
                      <QueueListIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                
                {/* Bundling Info */}
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-gray-900 truncate mb-1">
                    📦 {suggestion.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {formatPrice(suggestion.price)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      availabilityInfo.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {availabilityInfo.isAvailable 
                        ? `Tersedia (${availabilityInfo.quantity} paket)` 
                        : 'Terbatas'
                      }
                    </span>
                  </div>
                  {/* Product count indicator */}
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.products?.length || 0} produk dalam paket
                  </div>
                </div>
                
                {/* Available Icon */}
                {availabilityInfo.isAvailable && (
                  <SparklesIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Info */}
      {value && !showSuggestionDropdown && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Mencari bundling: "<span className="font-semibold text-blue-600">{value}</span>"
          </div>
          {resultsCount !== undefined && (
            <div className="text-gray-500">
              {resultsCount === 0 
                ? 'Tidak ada hasil' 
                : `${resultsCount} paket ditemukan`
              }
            </div>
          )}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && value.length >= 2 && !loadingSuggestions && suggestions.length === 0 && showSuggestionDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-5 text-center">
          <QueueListIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Tidak ada bundling yang cocok dengan "{value}"
          </p>
        </div>
      )}

      {/* Search Tips */}
      {!value && !showSuggestionDropdown && (
        <div className="mt-2 text-xs text-gray-400">
          💡 Tips: Coba cari "wedding", "portrait", atau "studio"
        </div>
      )}
    </div>
  );
}
