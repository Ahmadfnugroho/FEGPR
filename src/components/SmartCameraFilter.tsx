import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  CameraIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  availability: string[];
  features: string[];
  sortBy: string;
}

interface SmartCameraFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Array<{ id: string; name: string; slug: string; count?: number }>;
  brands: Array<{ id: string; name: string; slug: string; count?: number }>;
  priceRange: { min: number; max: number };
  isLoading?: boolean;
  totalResults?: number;
}

const SmartCameraFilter: React.FC<SmartCameraFilterProps> = ({
  filters,
  onFiltersChange,
  categories,
  brands,
  priceRange,
  isLoading = false,
  totalResults = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick filter presets for camera rental
  const quickFilters = [
    { id: 'dslr', label: 'DSLR', icon: '📷', category: 'dslr' },
    { id: 'mirrorless', label: 'Mirrorless', icon: '📸', category: 'mirrorless' },
    { id: 'action', label: 'Action Cam', icon: '🎥', category: 'action-camera' },
    { id: 'drone', label: 'Drone', icon: '🚁', category: 'drone' },
    { id: 'lens', label: 'Lensa', icon: '🔍', category: 'lens' },
    { id: 'lighting', label: 'Lighting', icon: '💡', category: 'lighting' },
    { id: 'tripod', label: 'Tripod', icon: '🦵', category: 'tripod' },
    { id: 'audio', label: 'Audio', icon: '🎤', category: 'audio' }
  ];

  // Price range presets for Indonesian market
  const priceRanges = [
    { label: 'Under 100K', min: 0, max: 100000 },
    { label: '100K - 300K', min: 100000, max: 300000 },
    { label: '300K - 500K', min: 300000, max: 500000 },
    { label: '500K - 1M', min: 500000, max: 1000000 },
    { label: 'Over 1M', min: 1000000, max: 10000000 }
  ];

  // Duration presets
  const durationPresets = [
    { label: '1 Hari', days: 1 },
    { label: '2-3 Hari', days: 3 },
    { label: '1 Minggu', days: 7 },
    { label: '2 Minggu', days: 14 },
    { label: '1 Bulan', days: 30 }
  ];

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Paling Relevan' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'popular', label: 'Paling Populer' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'availability', label: 'Ketersediaan' }
  ];

  // Camera features filter
  const cameraFeatures = [
    '4K Video', 'Full Frame', 'Weather Sealed', 'Image Stabilization',
    'WiFi', 'Bluetooth', 'Touchscreen', 'Dual Card Slots'
  ];

  const handleQuickFilter = useCallback((categorySlug: string) => {
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter(c => c !== categorySlug)
      : [...filters.categories, categorySlug];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  }, [filters, onFiltersChange]);

  const handlePriceRangeSelect = useCallback((range: { min: number; max: number }) => {
    onFiltersChange({
      ...filters,
      priceRange: range
    });
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    onFiltersChange({
      ...filters,
      search: value
    });
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      categories: [],
      brands: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      dateRange: { startDate: '', endDate: '' },
      availability: [],
      features: [],
      sortBy: 'relevance'
    });
  }, [onFiltersChange, priceRange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    count += filters.categories.length;
    count += filters.brands.length;
    if (filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    count += filters.availability.length;
    count += filters.features.length;
    return count;
  }, [filters, priceRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filter Produk Kamera</h3>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-blue-100 text-navy-blue-800">
                {activeFiltersCount} filter aktif
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {totalResults > 0 && (
              <span className="text-sm text-gray-600">
                {totalResults.toLocaleString('id-ID')} produk
              </span>
            )}
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kamera, lensa, atau accessories..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-blue-500 focus:border-navy-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleQuickFilter(filter.category)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.categories.includes(filter.category)
                  ? 'bg-navy-blue-100 text-navy-blue-800 border border-navy-blue-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Quick Select */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <CurrencyDollarIcon className="w-4 h-4" />
          Budget Rental per Hari
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePriceRangeSelect(range)}
              className={`p-2 text-sm border rounded-lg text-center transition-colors ${
                filters.priceRange.min === range.min && filters.priceRange.max === range.max
                  ? 'border-navy-blue-500 bg-navy-blue-50 text-navy-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Advanced Filters */}
      {isExpanded && (
        <div className="border-b border-gray-200">
          {/* Date Range */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Periode Rental
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mulai Rental</label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, startDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-blue-500 focus:border-navy-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Selesai Rental</label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  min={filters.dateRange.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, endDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-blue-500 focus:border-navy-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Brand</h4>
            <div className="max-h-32 overflow-y-auto">
              {brands.slice(0, 10).map((brand) => (
                <label key={brand.id} className="flex items-center py-1.5 hover:bg-gray-50 rounded px-2 -mx-2">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.slug)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...filters.brands, brand.slug]
                        : filters.brands.filter(b => b !== brand.slug);
                      onFiltersChange({ ...filters, brands: newBrands });
                    }}
                    className="rounded border-gray-300 text-navy-blue-600 focus:ring-navy-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    {brand.name}
                    {brand.count && (
                      <span className="ml-2 text-xs text-gray-500">({brand.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Camera Features */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Fitur Kamera</h4>
            <div className="flex flex-wrap gap-2">
              {cameraFeatures.map((feature) => (
                <label key={feature} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature)}
                    onChange={(e) => {
                      const newFeatures = e.target.checked
                        ? [...filters.features, feature]
                        : filters.features.filter(f => f !== feature);
                      onFiltersChange({ ...filters, features: newFeatures });
                    }}
                    className="rounded border-gray-300 text-navy-blue-600 focus:ring-navy-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Status Ketersediaan</h4>
            <div className="flex gap-4">
              {[
                { value: 'available', label: 'Tersedia', color: 'green' },
                { value: 'rented', label: 'Sedang Disewa', color: 'orange' },
                { value: 'maintenance', label: 'Maintenance', color: 'red' }
              ].map((status) => (
                <label key={status.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(status.value)}
                    onChange={(e) => {
                      const newAvailability = e.target.checked
                        ? [...filters.availability, status.value]
                        : filters.availability.filter(a => a !== status.value);
                      onFiltersChange({ ...filters, availability: newAvailability });
                    }}
                    className="rounded border-gray-300 text-navy-blue-600 focus:ring-navy-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Urutkan</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-navy-blue-500 focus:border-navy-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Filtering produk...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCameraFilter;
