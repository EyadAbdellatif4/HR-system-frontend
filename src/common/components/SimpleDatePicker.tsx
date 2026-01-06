import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDatePicker } from '@/common/hooks/useDatePicker';

/**
 * SimpleDatePicker component - Clean style matching form inputs
 * @param {Object} props
 * @param {string} props.value - Current date value (ISO string)
 * @param {Function} props.onChange - Callback when date is selected (receives ISO date string)
 * @param {boolean} props.show - Whether to show the picker
 * @param {Function} props.onClose - Callback to close the picker
 * @param {string} [props.minDate] - Minimum selectable date (ISO string)
 */
export function SimpleDatePicker({ value, onChange, show, onClose, minDate }) {
  const {
    currentMonth,
    today,
    minDateObj,
    selectedDate,
    handleDateClick,
    isDateDisabled,
    isDateSelected,
    isToday,
    goToPreviousMonth,
    goToNextMonth,
  } = useDatePicker({ value, minDate });

  if (!show) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Add days from previous month
  const prevMonthDays = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevMonthDays.unshift(prevMonthLastDay - i);
  }

  // Add days from next month to fill the grid
  const nextMonthDays = [];
  const totalCells = 42; // 6 weeks * 7 days
  const remainingCells = totalCells - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    nextMonthDays.push(day);
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-[280px]">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => goToPreviousMonth(year, month)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={() => goToNextMonth(year, month)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2" />;
          }

          const disabled = isDateDisabled(day, year, month);
          const selected = isDateSelected(day, year, month);
          const todayClass = isToday(day, year, month);

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day, year, month, onChange, onClose)}
              disabled={disabled}
              className={`
                p-2 text-sm rounded transition-colors
                ${disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-blue-50 cursor-pointer text-gray-700'
                }
                ${selected
                  ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700'
                  : ''
                }
                ${todayClass && !selected
                  ? 'border border-blue-500'
                  : ''
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            const todayStr = new Date().toISOString().split('T')[0];
            onChange(todayStr);
            onClose();
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Today
        </button>
        <button
          onClick={() => {
            onChange('');
            onClose();
          }}
          className="text-xs text-gray-600 hover:text-gray-700 font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

