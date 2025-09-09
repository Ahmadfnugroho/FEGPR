// src/components/ProductSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ProductSearch({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Cari produk...",
  className = ""
}: ProductSearchProps) {
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
    <div className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-white border rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-blue-500 shadow-md ring-2 ring-blue-100' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}>
          {/* Search Icon */}
          <div className="absolute left-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
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
        <button
          type="submit"
          className="sr-only"
          aria-label="Search products"
        >
          Search
        </button>
      </form>

      {/* Search Stats/Info */}
      {value && (
        <div className="mt-2 text-xs text-gray-500">
          Mencari: "<span className="font-medium text-gray-700">{value}</span>"
        </div>
      )}
    </div>
  );
}
