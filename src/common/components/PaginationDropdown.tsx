import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * PaginationDropdown Component
 * A styled dropdown for pagination limit selection
 * 
 * @param {Object} props
 * @param {number} props.value - Current selected value
 * @param {Function} props.onChange - Callback when value changes
 * @param {Array<number>} props.options - Array of options (default: [10, 25, 50, 100])
 * @param {string} props.className - Additional CSS classes
 */
export function PaginationDropdown({
  value,
  onChange,
  options = [10, 25, 50, 100],
  className = '',
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md min-w-[80px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PaginationDropdown;

