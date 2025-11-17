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
  const navigate = useNavigate();

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

        if (startDate && endDate) {
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
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [value, maxSuggestions, startDate, endDate, showSuggestions]);

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
          relative flex items-center bg-white border rounded-lg transition-all
          ${
            isFocused
              ? "border-blue-500 shadow-md ring-2 ring-blue-100"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
        >
          <div className="absolute left-3 pointer-events-none">
            {loadingSuggestions ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>

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

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 w-6 h-6 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* MAIN DROPDOWN */}
      {showSuggestions && showSuggestionDropdown && suggestions.length > 0 && (
        <ul className="py-1 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
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

      {value && !showSuggestionDropdown && (
        <div className="mt-2 text-xs text-gray-500">
          Mencari: "<span className="font-medium">{value}</span>"
        </div>
      )}

      {showSuggestions &&
        value.length >= 2 &&
        !loadingSuggestions &&
        suggestions.length === 0 &&
        showSuggestionDropdown && (
          <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow p-4 text-center text-sm text-gray-500">
            Tidak ada produk yang cocok dengan "{value}"
          </div>
        )}
    </div>
  );
}
