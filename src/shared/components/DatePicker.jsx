import React from 'react';
import { Card, CardBody, Button, Typography } from '@material-tailwind/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDatePicker } from '@/shared/hooks';

/**
 * DatePicker component
 * Purpose: Calendar popup for date selection in forms
 * @param {Object} props
 * @param {string} props.value - Current date value (ISO string)
 * @param {Function} props.onChange - Callback when date is selected (receives ISO date string)
 * @param {boolean} props.show - Whether to show the picker
 * @param {Function} props.onClose - Callback to close the picker
 * @param {string} [props.minDate] - Minimum selectable date (ISO string)
 */
export function DatePicker({ value, onChange, show, onClose, minDate }) {
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="absolute z-50 mt-1 shadow-lg">
      <CardBody className="p-4">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="text"
            size="sm"
            onClick={() => goToPreviousMonth(year, month)}
            className="p-1"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Typography variant="h6" className="text-text-primary">
            {monthNames[month]} {year}
          </Typography>
          <Button
            variant="text"
            size="sm"
            onClick={() => goToNextMonth(year, month)}
            className="p-1"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-text-secondary py-1"
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
                    : 'hover:bg-blue-100 cursor-pointer'
                  }
                  ${selected
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'text-text-primary'
                  }
                  ${todayClass && !selected
                    ? 'border-2 border-blue-300'
                    : ''
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

