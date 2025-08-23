import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FilterCheckboxGroup from "./FilterCheckboxGroup";
import FilterHeader from "./FilterHeader";
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

interface MobileFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilter: FilterData;
  setTempFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  tempPriceRange: PriceRangeData | null;
  setTempPriceRange: React.Dispatch<React.SetStateAction<PriceRangeData | null>>;
  priceBounds: PriceRangeData;
  categoryOptions: FilterOption[];
  brandOptions: FilterOption[];
  subCategoryOptions: FilterOption[];
  onApply: () => void;
  onReset: () => void;
}

export default function MobileFilterDialog({
  isOpen,
  onClose,
  tempFilter,
  setTempFilter,
  tempPriceRange,
  setTempPriceRange,
  priceBounds,
  categoryOptions,
  brandOptions,
  subCategoryOptions,
  onApply,
  onReset,
}: MobileFilterDialogProps) {
  const handleFilterChange = (key: keyof FilterData) => (values: string[]) => {
    setTempFilter((prev) => ({ ...prev, [key]: values }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-40 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative ml-auto flex h-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full w-full"
        >
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 px-4">
            {/* Filter Header with Clear All */}
            <FilterHeader
              currentFilters={tempFilter}
              priceRange={tempPriceRange}
              onClearAll={onReset}
              onClearCategory={(value) => {
                setTempFilter((prev) => ({
                  ...prev,
                  category: prev.category.filter((c) => c !== value),
                }));
              }}
              onClearSubcategory={(value) => {
                setTempFilter((prev) => ({
                  ...prev,
                  subcategory: prev.subcategory.filter((s) => s !== value),
                }));
              }}
              onClearAvailable={(value) => {
                setTempFilter((prev) => ({
                  ...prev,
                  available: prev.available.filter((a) => a !== value),
                }));
              }}
              onClearPrice={() => setTempPriceRange(null)}
              onClearSearch={() => {
                setTempFilter((prev) => ({ ...prev, q: "" }));
              }}
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
              subCategoryOptions={subCategoryOptions}
            />
          </div>

          <form className="border-t border-gray-200 px-4">
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}
