import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * SimpleDropdown Component
 * A styled dropdown for simple text options (no images)
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of {value, label} objects
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Callback when item is selected
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.required - Required field
 */
export function SimpleDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  loading = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value || opt.value?.toString() === value?.toString());

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Option Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : selectedOption ? (
          <span className="text-gray-900">{selectedOption.label}</span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {!required && (
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {placeholder}
                </button>
              )}
              {options.map((option) => {
                const isSelected = (option.value === value || option.value?.toString() === value?.toString());

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

