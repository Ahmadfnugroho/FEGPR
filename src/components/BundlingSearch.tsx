// src/components/BundlingSearch.tsx
import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, QueueListIcon } from '@heroicons/react/24/outline';

interface BundlingSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  resultsCount?: number;
}

export default function BundlingSearch({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Cari bundling...",
  className = "",
  resultsCount
}: BundlingSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
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
            <QueueListIcon className="h-5 w-5 text-blue-500" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-16 py-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base font-medium"
          />

          {/* Search Stats */}
          {resultsCount !== undefined && value && (
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

      {/* Search Info */}
      {value && (
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

      {/* Search Tips */}
      {!value && (
        <div className="mt-2 text-xs text-gray-400">
          💡 Tips: Coba cari "wedding", "portrait", atau "studio"
        </div>
      )}
    </div>
  );
}
