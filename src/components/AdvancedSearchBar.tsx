// src/components/AdvancedSearchBar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAutocomplete } from "../hooks/useAdvancedSearch";
import { STORAGE_BASE_URL } from "../api/constants";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  maxSuggestions?: number;
}

export default function SearchBar({
  className = "",
  placeholder = "Cari produk, bundling...",
  maxSuggestions = 6,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading, error } = useAutocomplete(
    query,
    maxSuggestions
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch(e as any);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const selectSuggestion = (suggestion: any) => {
    navigate(suggestion.url);
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
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
    <form
      onSubmit={handleSearch}
      className={`flex-1 max-w-[320px] md:max-w-[480px] px-2 md:px-4 relative ${className}`}
      role="search"
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full border border-support-subtle h-10 md:h-12 shadow-sm px-3 md:px-4 py-2 pr-20 rounded-full text-support-primary placeholder:text-support-tertiary focus:outline-none focus:ring-2 focus:ring-pop-primary/40 focus:border-pop-primary text-sm md:text-base transition-all duration-300 focus:shadow-md bg-background-light-card"
          placeholder={placeholder}
          aria-label="Pencarian produk dan bundling"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          autoComplete="off"
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-3 md:top-4 right-12 md:right-14">
            <div className="animate-spin h-4 w-4 border-2 border-pop-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute top-2.5 md:top-3.5 right-8 md:right-10 text-support-tertiary transition-all duration-300 hover:text-support-primary hover:scale-110"
            aria-label="Hapus pencarian"
          >
            <XMarkIcon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="absolute top-2.5 md:top-3.5 right-2 md:right-3 text-support-tertiary transition-all duration-300 hover:text-pop-primary hover:scale-110"
          aria-label="Cari"
        >
          <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          role="listbox"
          aria-label="Saran pencarian"
        >
          {suggestions.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              onClick={() => selectSuggestion(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index ? "bg-blue-50 border-blue-200" : ""
              }`}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {/* Thumbnail */}
              {item.thumbnail ? (
                <img
                  src={`${STORAGE_BASE_URL}/${item.thumbnail}`}
                  alt=""
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  {item.type === "bundling" ? "📦" : "📷"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Name */}
                <div className="font-medium text-support-primary truncate">
                  {item.name}
                </div>

                {/* Type and Price */}
                <div className="flex items-center justify-between text-xs text-support-tertiary mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "product"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type === "product" ? "Produk" : "Bundling"}
                  </span>

                  {item.price && (
                    <span className="font-semibold text-pop-primary">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* Show more results link */}
          {suggestions.length >= maxSuggestions && query.trim() && (
            <div className="px-3 md:px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  setShowSuggestions(false);
                }}
                className="w-full text-center text-pop-primary hover:text-pop-secondary text-sm font-medium transition-colors"
              >
                Lihat semua hasil untuk "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {showSuggestions &&
        query.length >= 2 &&
        suggestions.length === 0 &&
        !isLoading && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-support-subtle rounded-lg shadow-lg z-50 p-4 text-center"
          >
            <div className="text-support-tertiary text-sm">
              Tidak ada hasil untuk "{query}"
            </div>
            <button
              type="button"
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(query)}`);
                setShowSuggestions(false);
              }}
              className="mt-2 text-pop-primary hover:text-pop-secondary text-sm font-medium transition-colors bg-white px-3 py-1 rounded"
            >
              Cari di semua produk
            </button>
          </div>
        )}

      {/* Error message */}
      {error && showSuggestions && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-red-200 rounded-lg shadow-lg z-50 p-4 text-center"
        >
          <div className="text-red-600 text-sm">
            Terjadi kesalahan saat mencari. Silakan coba lagi.
          </div>
        </div>
      )}
    </form>
  );
}
