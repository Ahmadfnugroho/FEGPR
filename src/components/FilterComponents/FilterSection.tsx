import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import ReactSelect from "react-select";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  className?: string;
}

const rsStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: "rgb(209 213 219)", // gray-300
    boxShadow: "none",
    minHeight: "40px",
    "&:hover": { borderColor: "rgb(156 163 175)" }, // gray-400
  }),
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, { isSelected, isFocused }: any) => ({
    ...base,
    backgroundColor: isSelected
      ? "rgb(99 102 241)" // indigo-600
      : isFocused
      ? "rgb(238 242 255)" // indigo-50
      : "white",
    color: isSelected ? "white" : "rgb(17 24 39)", // gray-900
  }),
};

export default function FilterSection({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
  isMulti = true,
  className = "",
}: FilterSectionProps) {
  const handleChange = (selected: any) => {
    if (isMulti) {
      onChange(selected ? selected.map((s: any) => s.value) : []);
    } else {
      onChange(selected ? [selected.value] : []);
    }
  };

  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  return (
    <Disclosure as="div" className={`border-b border-gray-200 py-6 ${className}`}>
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">{title}</span>
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
        <ReactSelect
          isMulti={isMulti}
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          styles={rsStyles}
          placeholder={placeholder}
          className="text-sm"
        />
      </DisclosurePanel>
    </Disclosure>
  );
}
