import React from 'react';
import { Card, CardBody, Button, Typography } from '@material-tailwind/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDateRangePicker } from '@/common/hooks/useDateRangePicker';

/**
 * DateRangePicker component
 * Purpose: Calendar popup for date range selection (start and end dates)
 * @param {Object} props
 * @param {Object} props.value - Current date range value { from: string, to: string } (ISO strings)
 * @param {Function} props.onChange - Callback when date range is selected (receives { from: string, to: string })
 * @param {boolean} props.show - Whether to show the picker
 * @param {Function} props.onClose - Callback to close the picker
 */
export function DateRangePicker({ value, onChange, show, onClose }) {
  const {
    currentMonth,
    selectingStart,
    tempStartDate,
    tempEndDate,
    parseDate,
    formatDateDisplay,
    handleDateClick,
    handleOK,
    handleClear,
    handleCancel,
    goToPreviousMonth,
    goToNextMonth,
    isDateInRange,
    isDateSelected,
    displayText,
  } = useDateRangePicker({ value, onChange, onClose });

  if (!show) return null;

  const today = new Date();
  const startDate = value?.from ? parseDate(value.from) : null;
  const endDate = value?.to ? parseDate(value.to) : null;
  const currentStart = tempStartDate || startDate;
  const currentEnd = tempEndDate || endDate;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="absolute z-50 mt-1 shadow-lg min-w-[320px] w-[320px] right-0">
      <CardBody className="p-5">
        {/* Header with selected date range */}
        <div className="mb-5">
          <Typography variant="small" className="text-text-secondary mb-2 text-xs font-normal">
            Select date
          </Typography>
          <Typography variant="h6" className="text-text-primary font-bold text-base">
            {displayText}
          </Typography>
        </div>

        {/* Month/Year Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="text"
            size="sm"
            onClick={() => goToPreviousMonth(year, month)}
            className="p-1 hover:bg-blue-50"
          >
            <ChevronLeftIcon className="w-5 h-5 text-text-primary" />
          </Button>
          <Typography variant="h6" className="text-text-primary font-bold">
            {monthNames[month]} {year}
          </Typography>
          <Button
            variant="text"
            size="sm"
            onClick={() => goToNextMonth(year, month)}
            className="p-1 hover:bg-blue-50"
          >
            <ChevronRightIcon className="w-5 h-5 text-text-primary" />
          </Button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-text-secondary py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2" />;
            }

            const inRange = isDateInRange(day, year, month);
            const selected = isDateSelected(day, year, month);
            const todayClass = isToday(day);
            
            // Check if previous/next day is in range for proper border radius
            const prevDay = index > 0 ? days[index - 1] : null;
            const nextDay = index < days.length - 1 ? days[index + 1] : null;
            const prevInRange = prevDay !== null && isDateInRange(prevDay, year, month);
            const nextInRange = nextDay !== null && isDateInRange(nextDay, year, month);
            
            // Determine border radius for range highlighting
            let borderRadius = '';
            if (selected === 'start') {
              borderRadius = '9999px 0 0 9999px';
            } else if (selected === 'end') {
              borderRadius = '0 9999px 9999px 0';
            } else if (inRange) {
              if (!prevInRange && nextInRange) {
                borderRadius = '9999px 0 0 9999px'; // Start of range
              } else if (prevInRange && !nextInRange) {
                borderRadius = '0 9999px 9999px 0'; // End of range
              } else if (!prevInRange && !nextInRange) {
                borderRadius = '9999px'; // Single day in range
              }
            } else {
              borderRadius = '9999px'; // Normal rounded
            }

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day, year, month)}
                className={`
                  p-2.5 text-sm transition-all relative
                  ${selected === 'start'
                    ? 'bg-blue-500 text-white font-semibold'
                    : selected === 'end'
                    ? 'bg-blue-500 text-white font-semibold'
                    : inRange
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-blue-50 cursor-pointer text-text-primary'
                  }
                  ${todayClass && !selected && !inRange
                    ? 'border-2 border-blue-300'
                    : ''
                  }
                `}
                style={{ borderRadius }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200">
          <Button
            variant="text"
            size="sm"
            onClick={handleClear}
            disabled={!currentStart && !currentEnd}
            className="text-blue-500 font-medium uppercase text-xs tracking-wide disabled:opacity-50 hover:bg-blue-50 px-3 py-1.5"
          >
            Clear
          </Button>
          <div className="flex gap-3">
            <Button
              variant="text"
              size="sm"
              onClick={handleCancel}
              className="text-blue-500 font-medium uppercase text-xs tracking-wide hover:bg-blue-50 px-3 py-1.5"
            >
              Cancel
            </Button>
            <Button
              variant="text"
              size="sm"
              onClick={handleOK}
              disabled={!currentStart || !currentEnd}
              className="text-blue-500 font-medium uppercase text-xs tracking-wide disabled:opacity-50 hover:bg-blue-50 px-3 py-1.5"
            >
              OK
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

