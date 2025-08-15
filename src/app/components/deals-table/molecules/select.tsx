/** @format */

"use client";

/**
 * Select Molecule Component
 * Custom dropdown select with professional styling
 * Supports color indicators and search functionality
 */

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  color?: string;
  description?: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className = "",
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.value === value)
  );
  const selectRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onValueChange?.(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        className={`
          relative w-full cursor-pointer rounded-lg border px-3 py-2 text-left
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:border-slate-400 dark:hover:border-slate-500"
          }
          ${
            isOpen
              ? "border-slate-500 ring-2 ring-slate-500 dark:border-slate-400 dark:ring-slate-400"
              : "border-slate-300 dark:border-slate-600"
          }
          bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.color && (
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="block truncate text-sm">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
          absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-lg
          bg-white shadow-lg ring-1 ring-black ring-opacity-5
          dark:bg-slate-900 dark:ring-slate-700
          animate-in fade-in-0 zoom-in-95 duration-200
        `}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full px-2 py-1 text-sm rounded border
                  border-slate-300 dark:border-slate-600
                  bg-white dark:bg-slate-800
                  text-slate-900 dark:text-slate-100
                  focus:outline-none focus:ring-1 focus:ring-slate-500
                `}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left
                    transition-colors duration-150
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    focus:bg-slate-100 dark:focus:bg-slate-800
                    ${
                      selectedOption?.value === option.value
                        ? "bg-slate-50 dark:bg-slate-800/50"
                        : ""
                    }
                  `}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedOption?.value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
