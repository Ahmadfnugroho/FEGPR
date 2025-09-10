// src/components/ProductSearch.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { STORAGE_BASE_URL } from "../api/constants";
import {
  Product,
  ProductPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";
import {
  isProductAvailable,
  getProductAvailabilityText,
} from "../utils/availabilityUtils";
import { localDateToUTC } from "../utils/dateUtils";

interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  available_quantity?: number;
  is_available?: boolean;
  status: "available" | "unavailable";
  quantity: number;
  productPhotos: ProductPhoto[];
  productSpecifications: productSpecification[];
  rentalIncludes: RentalInclude[];
}

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  startDate?: string;
  endDate?: string;
  onSuggestionSelect?: (product: ProductSuggestion) => void;
}

export default function ProductSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Cari produk...",
  className = "",
  showSuggestions = true,
  maxSuggestions = 6,
  startDate,
  endDate,
  onSuggestionSelect,
}: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch product suggestions with availability
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
          limit: maxSuggestions,
        };

        // Include date range if provided for availability check
        if (startDate && endDate) {
          // Convert local date strings to UTC for API
          params.start_date =
            localDateToUTC(startDate)?.split("T")[0] || startDate;
          params.end_date = localDateToUTC(endDate)?.split("T")[0] || endDate;
        }

        const response = await axiosInstance.get("/search-suggestions", {
          params,
        });

        if (response.data.suggestions) {
          setSuggestions(response.data.suggestions);
          setShowSuggestionDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestionDropdown(false);
    }
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
    setSuggestions([]);
    setShowSuggestionDropdown(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: ProductSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      // Default behavior - navigate to product page
      navigate(`/product/${suggestion.slug}`);
    }
    setShowSuggestionDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
          relative flex items-center bg-white border rounded-lg transition-all duration-200
          ${
            isFocused
              ? "border-blue-500 shadow-md ring-2 ring-blue-100"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
        >
          {/* Search Icon */}
          <div className="absolute left-3 flex items-center pointer-events-none">
            {loadingSuggestions ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
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
              if (
                showSuggestions &&
                value.length >= 2 &&
                suggestions.length > 0
              ) {
                setShowSuggestionDropdown(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
          />

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Button (Hidden but functional for Enter key) */}
        <button type="submit" className="sr-only" aria-label="Search products">
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionDropdown && suggestions.length > 0 && (
        <ul className="py-1">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                {suggestion.thumbnail && (
                  <img
                    src={`${STORAGE_BASE_URL}/${suggestion.thumbnail}`}
                    alt={suggestion.name}
                    className="w-8 h-8 object-cover rounded-md mr-3"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(suggestion.price)}
                  </p>
                </div>
              </div>
              {suggestion.is_available !== undefined && (
                <span
                  className={`text-xs font-semibold ${
                    isProductAvailable(suggestion)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getProductAvailabilityText(suggestion).text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
      >
        {suggestions.map((suggestion) => {
          // Handle availability for suggestion type (which has limited fields)
          const availabilityInfo = {
            isAvailable: suggestion.is_available ?? true,
            quantity: suggestion.available_quantity ?? 0,
            text:
              suggestion.is_available &&
              (suggestion.available_quantity ?? 0) > 0
                ? `Tersedia (${suggestion.available_quantity})`
                : "Tidak tersedia",
          };
          return (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors"
            >
              {/* Product Image */}
              {suggestion.thumbnail && (
                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={`${STORAGE_BASE_URL}/${suggestion.thumbnail}`}
                    alt={suggestion.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=No+Image";
                    }}
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {suggestion.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-blue-600 font-medium">
                    {formatPrice(suggestion.price)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      availabilityInfo.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {availabilityInfo.isAvailable
                      ? `Tersedia (${availabilityInfo.quantity})`
                      : "Tidak tersedia"}
                  </span>
                </div>
              </div>

              {/* Available Icon */}
              {availabilityInfo.isAvailable && (
                <SparklesIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Stats/Info */}
      {value && !showSuggestionDropdown && (
        <div className="mt-2 text-xs text-gray-500">
          Mencari: "<span className="font-medium text-gray-700">{value}</span>"
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions &&
        value.length >= 2 &&
        !loadingSuggestions &&
        suggestions.length === 0 &&
        showSuggestionDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-sm text-gray-500">
            Tidak ada produk yang cocok dengan "{value}"
          </div>
        )}
    </div>
  );
}
