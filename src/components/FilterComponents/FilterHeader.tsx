import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface FilterData {
  category: string[];
  brand: string[];
  subcategory: string[];
  available: string[];
  q: string;
}

interface FilterHeaderProps {
  currentFilters: FilterData;
  priceRange: { min: number; max: number } | null;
  onClearAll: () => void;
  onClearCategory: (value: string) => void;
  onClearBrand: (value: string) => void;
  onClearSubcategory: (value: string) => void;
  onClearAvailable: (value: string) => void;
  onClearPrice: () => void;
  onClearSearch: () => void;
  categoryOptions: { label: string; value: string }[];
  brandOptions: { label: string; value: string }[];
  subCategoryOptions: { label: string; value: string }[];
}

export default function FilterHeader({
  currentFilters,
  priceRange,
  onClearAll,
  onClearCategory,
  onClearBrand,
  onClearSubcategory,
  onClearAvailable,
  onClearPrice,
  onClearSearch,
  categoryOptions,
  brandOptions,
  subCategoryOptions,
}: FilterHeaderProps) {
  // Calculate total active filters with null checks
  const activeFiltersCount =
    (currentFilters.category || []).length +
    (currentFilters.brand || []).length +
    (currentFilters.subcategory || []).length +
    (currentFilters.available || []).length +
    (priceRange && priceRange.min !== 0 && priceRange.max !== 0 ? 1 : 0) +
    (currentFilters.q ? 1 : 0);

  // Get filter items with individual remove handlers
  const getActiveFilterItems = () => {
    const items: { label: string; onRemove: () => void; type: string }[] = [];

    // Add category items with null checks
    (currentFilters.category || []).forEach((cat) => {
      const option = (categoryOptions || []).find((opt) => opt.value === cat);
      if (option) {
        items.push({
          label: option.label,
          onRemove: () => onClearCategory(cat),
          type: "category",
        });
      }
    });

    // Add brand items with null checks
    (currentFilters.brand || []).forEach((brand) => {
      const option = (brandOptions || []).find((opt) => opt.value === brand);
      if (option) {
        items.push({
          label: option.label,
          onRemove: () => onClearBrand(brand),
          type: "brand",
        });
      }
    });

    // Add subcategory items with null checks
    (currentFilters.subcategory || []).forEach((sub) => {
      const option = (subCategoryOptions || []).find((opt) => opt.value === sub);
      if (option) {
        items.push({
          label: option.label,
          onRemove: () => onClearSubcategory(sub),
          type: "subcategory",
        });
      }
    });

    // Add availability items with null checks
    (currentFilters.available || []).forEach((avail) => {
      items.push({
        label: avail === "1" ? "Tersedia" : "Tidak Tersedia",
        onRemove: () => onClearAvailable(avail),
        type: "availability",
      });
    });

    // Add price range (only if meaningful)
    if (priceRange && (priceRange.min > 0 || priceRange.max < 10000000)) {
      const minFormatted = priceRange.min.toLocaleString("id-ID");
      const maxFormatted = priceRange.max.toLocaleString("id-ID");
      items.push({
        label: `Harga: Rp ${minFormatted} - Rp ${maxFormatted}`,
        onRemove: onClearPrice,
        type: "price",
      });
    }

    // Add search query
    if (currentFilters.q) {
      items.push({
        label: `"${currentFilters.q}"`,
        onRemove: onClearSearch,
        type: "search",
      });
    }

    return items;
  };

  const activeItems = getActiveFilterItems();

  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
      {/* Header with title and clear all button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-800">
          Filter Aktif ({activeFiltersCount})
        </h3>
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      {/* Active filter chips with individual remove buttons */}
      <div className="flex flex-wrap gap-2">
        {activeItems.map((item, index) => (
          <span
            key={`${item.type}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 border border-blue-200"
          >
            <span className="truncate max-w-xs">{item.label}</span>
            <button
              onClick={item.onRemove}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
              title={`Hapus filter ${item.label}`}
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
