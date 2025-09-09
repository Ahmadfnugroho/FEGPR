// src/components/ActiveFilters.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ActiveFiltersProps {
  filters: {
    categories?: string[];
    brands?: string[];
    subcategories?: string[];
    available?: string[];
    query?: string;
    priceRange?: { min: number; max: number } | null;
  };
  onClearCategory?: (value: string) => void;
  onClearBrand?: (value: string) => void;
  onClearSubcategory?: (value: string) => void;
  onClearAvailable?: (value: string) => void;
  onClearQuery?: () => void;
  onClearPrice?: () => void;
  onClearAll?: () => void;
  categoryOptions?: { label: string; value: string }[];
  brandOptions?: { label: string; value: string }[];
  subcategoryOptions?: { label: string; value: string }[];
}

export default function ActiveFilters({
  filters,
  onClearCategory,
  onClearBrand,
  onClearSubcategory,
  onClearAvailable,
  onClearQuery,
  onClearPrice,
  onClearAll,
  categoryOptions = [],
  brandOptions = [],
  subcategoryOptions = []
}: ActiveFiltersProps) {
  // Helper function to get label from value
  const getLabel = (value: string, options: { label: string; value: string }[]) => {
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Helper function to check if price range is valid (not default 0-0)
  const isValidPriceRange = (priceRange: { min: number; max: number } | null) => {
    return priceRange && (priceRange.min > 0 || priceRange.max > 0) && 
           !(priceRange.min === 0 && priceRange.max === 0);
  };

  // Count active filters
  const activeFiltersCount = 
    (filters.categories?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.subcategories?.length || 0) +
    (filters.available?.length || 0) +
    (filters.query ? 1 : 0) +
    (isValidPriceRange(filters.priceRange) ? 1 : 0);

  if (activeFiltersCount === 0) return null;

  return (
    <div className="mb-3 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Filter Aktif ({activeFiltersCount})
        </span>
        <button
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
        >
          Hapus Semua
        </button>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Categories */}
        {filters.categories?.map((category) => (
          <FilterTag
            key={`category-${category}`}
            label={getLabel(category, categoryOptions)}
            onClear={() => onClearCategory?.(category)}
            color="blue"
          />
        ))}

        {/* Brands */}
        {filters.brands?.map((brand) => (
          <FilterTag
            key={`brand-${brand}`}
            label={getLabel(brand, brandOptions)}
            onClear={() => onClearBrand?.(brand)}
            color="green"
          />
        ))}

        {/* Subcategories */}
        {filters.subcategories?.map((subcategory) => (
          <FilterTag
            key={`subcategory-${subcategory}`}
            label={getLabel(subcategory, subcategoryOptions)}
            onClear={() => onClearSubcategory?.(subcategory)}
            color="purple"
          />
        ))}

        {/* Available */}
        {filters.available?.map((available) => (
          <FilterTag
            key={`available-${available}`}
            label={available === 'true' ? 'Tersedia' : 'Tidak Tersedia'}
            onClear={() => onClearAvailable?.(available)}
            color="amber"
          />
        ))}

        {/* Search Query */}
        {filters.query && (
          <FilterTag
            label={`"${filters.query}"`}
            onClear={onClearQuery}
            color="gray"
          />
        )}

        {/* Price Range - Only show if valid */}
        {isValidPriceRange(filters.priceRange) && (
          <FilterTag
            label={`Rp ${filters.priceRange!.min.toLocaleString('id-ID')} - Rp ${filters.priceRange!.max.toLocaleString('id-ID')}`}
            onClear={onClearPrice}
            color="indigo"
          />
        )}
      </div>
    </div>
  );
}

// Filter Tag Component
interface FilterTagProps {
  label: string;
  onClear?: () => void;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'gray' | 'indigo';
}

function FilterTag({ label, onClear, color }: FilterTagProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-colors
      ${colorClasses[color]}
    `}>
      <span className="truncate max-w-32">{label}</span>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center w-3 h-3 rounded-full hover:bg-white/50 transition-colors flex-shrink-0"
          aria-label={`Remove ${label} filter`}
        >
          <XMarkIcon className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}
