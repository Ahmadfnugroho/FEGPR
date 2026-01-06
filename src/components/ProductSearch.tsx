// src/components/ProductSearch.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
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
import useSearchSuggestions, {
  Suggestion as SearchSuggestion,
} from "../hooks/useSearchSuggestions";

type ProductSuggestion = SearchSuggestion;

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  /** Max product suggestions to request */
  productLimit?: number;
  /** Max bundling suggestions to request */
  bundlingLimit?: number;
  /** Debounce in milliseconds for suggestions */
  debounceMs?: number;
  startDate?: string;
  endDate?: string;
  onSuggestionSelect?: (product: ProductSuggestion) => void;
  /** Optional external signal to close the suggestion dropdown (e.g. incrementing counter) */
  externalCloseSignal?: any;
  /** Optional callback when suggestions are closed */
  onClose?: () => void;
}

export default function ProductSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Cari produk...",
  className = "",
  showSuggestions = true,
  productLimit = 10,
  bundlingLimit = 5,
  debounceMs = 300,
  startDate,
  endDate,
  onSuggestionSelect,
  externalCloseSignal,
  onClose,
}: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const {
    suggestions,
    loading: loadingSuggestions,
    products: suggestionProducts,
    bundlings: suggestionBundlings,
  } = useSearchSuggestions(value, {
    debounceMs,
    productLimit,
    bundlingLimit,
    enabled: showSuggestions,
  });
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  // keep latest onClose in a ref to avoid stale closures
  const propsOnCloseRef = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    propsOnCloseRef.current = onClose;
  }, [onClose]);

  // suggestions + loading provided by useSearchSuggestions hook
  useEffect(() => {
    if (!showSuggestions || value.length < 2) {
      setShowSuggestionDropdown(false);
      return;
    }
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestionDropdown(true);
    }
  }, [suggestions, value, showSuggestions]);

  // Click-away and Escape handling: close suggestion dropdown when clicking outside
  // or when pressing Escape.
  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      const node = containerRef.current;
      if (!node) return;
      if (e.target instanceof Node && !node.contains(e.target)) {
        if (showSuggestionDropdown) {
          setShowSuggestionDropdown(false);
          if (propsOnCloseRef.current) propsOnCloseRef.current();
        }
      }
    };

    const onDocumentKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showSuggestionDropdown) {
          setShowSuggestionDropdown(false);
          if (propsOnCloseRef.current) propsOnCloseRef.current();
        }
      }
    };

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onDocumentKey, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      document.removeEventListener("keydown", onDocumentKey, true);
    };
  }, [showSuggestionDropdown]);

  // Support external signal to close suggestions
  useEffect(() => {
    if (externalCloseSignal !== undefined) {
      setShowSuggestionDropdown(false);
      if (propsOnCloseRef.current) propsOnCloseRef.current();
    }
    // only trigger when externalCloseSignal changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCloseSignal]);

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
      if (suggestion.type === "bundling") {
        navigate(`/bundling/${suggestion.slug}`);
      } else {
        navigate(`/product/${suggestion.slug}`);
      }
    }
    setShowSuggestionDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showSuggestionDropdown) {
        setShowSuggestionDropdown(false);
        if (onClose) onClose();
      }
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
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
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
            onBlur={() => {
              setIsFocused(false);
              // Delay check so clicks inside the container (suggestion items)
              // won't be treated as outside clicks.
              setTimeout(() => {
                if (
                  containerRef.current &&
                  !containerRef.current.contains(document.activeElement)
                ) {
                  setShowSuggestionDropdown(false);
                  if (onClose) onClose();
                }
              }, 0);
            }}
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

      {/* MAIN DROPDOWN - grouped: Products then Bundlings */}
      {showSuggestions &&
        showSuggestionDropdown &&
        (suggestionProducts.length > 0 || suggestionBundlings.length > 0) && (
          <div className="py-1 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-72 overflow-y-auto">
            {suggestionProducts.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                  Produk
                </div>
                <ul>
                  {suggestionProducts.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(s as ProductSuggestion)
                      }
                    >
                      <div className="flex items-center">
                        {s.thumbnail && (
                          <img
                            src={`${STORAGE_BASE_URL}/${s.thumbnail}`}
                            alt={s.name}
                            className="w-8 h-8 object-cover rounded-md mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {s.name}
                          </p>
                          {typeof s.price === "number" && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(s.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      {s.is_available !== undefined && (
                        <span
                          className={`text-xs font-semibold ${
                            isProductAvailable(s)
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {getProductAvailabilityText(s).text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestionBundlings.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                  Bundling
                </div>
                <ul>
                  {suggestionBundlings.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSuggestionClick(s as ProductSuggestion)
                      }
                    >
                      <div className="flex items-center">
                        {s.thumbnail && (
                          <img
                            src={`${STORAGE_BASE_URL}/${s.thumbnail}`}
                            alt={s.name}
                            className="w-8 h-8 object-cover rounded-md mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-blue-700">
                            {s.name}
                          </p>
                          {typeof s.price === "number" && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(s.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-blue-600 ml-auto px-1 py-0.5 bg-blue-50 rounded">
                        Bundling
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
            Tidak ada hasil untuk "{value}".{" "}
            <button
              onClick={() => onSearch(value)}
              className="text-blue-600 underline ml-1"
            >
              Lihat semua hasil
            </button>
          </div>
        )}
    </div>
  );
}
