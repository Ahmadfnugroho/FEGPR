import React from "react";
import FilterCheckboxGroup from "./FilterCheckboxGroup";
import PriceRange from "../PriceRange";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterData {
  category: string[];
  brand: string[];
  subcategory: string[];
  available: string[];
  q: string;
}

interface PriceRangeData {
  min: number;
  max: number;
}

interface DesktopFilterSidebarProps {
  tempFilter: FilterData;
  setTempFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  tempPriceRange: PriceRangeData | null;
  setTempPriceRange: React.Dispatch<React.SetStateAction<PriceRangeData | null>>;
  priceRange: PriceRangeData | null;
  priceBounds: PriceRangeData;
  categoryOptions: FilterOption[];
  brandOptions: FilterOption[];
  subCategoryOptions: FilterOption[];
  onApply: () => void;
  onReset: () => void;
}

export default function DesktopFilterSidebar({
  tempFilter,
  setTempFilter,
  tempPriceRange,
  setTempPriceRange,
  priceRange,
  priceBounds,
  categoryOptions,
  brandOptions,
  subCategoryOptions,
  onApply,
  onReset,
}: DesktopFilterSidebarProps) {
  const handleFilterChange = (key: keyof FilterData) => (values: string[]) => {
    setTempFilter((prev) => ({ ...prev, [key]: values }));
  };

  return (
    <form className="hidden lg:block">
      <h3 className="sr-only">Filters</h3>

      <FilterCheckboxGroup
        title="Kategori"
        options={categoryOptions}
        selectedValues={tempFilter.category}
        onChange={handleFilterChange("category")}
        className="border-t-0 pt-0"
        defaultOpen={true}
      />

      <FilterCheckboxGroup
        title="Sub Kategori"
        options={subCategoryOptions}
        selectedValues={tempFilter.subcategory}
        onChange={handleFilterChange("subcategory")}
        defaultOpen={false}
      />

      <FilterCheckboxGroup
        title="Brand"
        options={brandOptions}
        selectedValues={tempFilter.brand}
        onChange={handleFilterChange("brand")}
        defaultOpen={false}
      />

      <FilterCheckboxGroup
        title="Status Ketersediaan"
        options={[
          { label: "Tersedia", value: "1" },
          { label: "Tidak Tersedia", value: "0" },
        ]}
        selectedValues={tempFilter.available}
        onChange={handleFilterChange("available")}
        defaultOpen={false}
        showSelectAll={false}
      />

      <div className="border-b border-gray-200 py-6">
        <h3 className="mb-4 text-sm font-medium text-gray-900">
          Rentang Harga
        </h3>
        <PriceRange
          min={priceBounds.min}
          max={priceBounds.max}
          valueMin={tempPriceRange?.min ?? null}
          valueMax={tempPriceRange?.max ?? null}
          onChange={(min, max) => {
            setTempPriceRange(
              min == null && max == null
                ? null
                : {
                    min: min ?? priceBounds.min,
                    max: max ?? priceBounds.max,
                  }
            );
          }}
        />
        {/* Badge if price filter is active */}
        {priceRange && (priceRange.min != null || priceRange.max != null) && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-amber-500 text-white rounded">
            Filter harga aktif
          </span>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onApply}
          className="flex-1 bg-text-light-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Terapkan
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
