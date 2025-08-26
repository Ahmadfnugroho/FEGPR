import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  defaultOpen?: boolean;
  showSelectAll?: boolean;
}

export default function FilterCheckboxGroup({
  title,
  options,
  selectedValues,
  onChange,
  className = "",
  defaultOpen = false,
  showSelectAll = true,
}: FilterCheckboxGroupProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      // Deselect all
      onChange([]);
    } else {
      // Select all
      onChange(options.map(opt => opt.value));
    }
  };

  const selectedCount = selectedValues.length;
  const allSelected = selectedCount === options.length && options.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < options.length;

  return (
    <Disclosure as="div" className={`border-b border-gray-200 py-6 ${className}`} defaultOpen={defaultOpen}>
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900 flex items-center">
            {title}
            {selectedCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                {selectedCount}
              </span>
            )}
          </span>
          <span className="ml-6 flex items-center">
            <PlusIcon
              aria-hidden="true"
              className="h-5 w-5 group-data-[open]:hidden"
            />
            <MinusIcon
              aria-hidden="true"
              className="h-5 w-5 group-[&:not([data-open])]:hidden"
            />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {/* Select All option */}
          {showSelectAll && options.length > 0 && (
            <div className="flex items-center border-b border-gray-100 pb-3 mb-3">
              <div className="flex h-5 items-center">
                <input
                  id={`selectall-${title.toLowerCase().replace(/\s+/g, '-')}`}
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`selectall-${title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-medium text-gray-700 cursor-pointer"
                >
                  {allSelected ? 'Batalkan Semua' : 'Pilih Semua'}
                </label>
              </div>
            </div>
          )}
          
          {/* Individual options */}
          {options.map((option, optionIdx) => (
            <div key={option.value} className="flex items-center">
              <div className="flex h-5 items-center">
                <input
                  id={`filter-${title.toLowerCase().replace(/\s+/g, '-')}-${optionIdx}`}
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`filter-${title.toLowerCase().replace(/\s+/g, '-')}-${optionIdx}`}
                  className="text-gray-600 cursor-pointer hover:text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
          
          {options.length === 0 && (
            <p className="text-sm text-gray-500 italic">Tidak ada pilihan tersedia</p>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
