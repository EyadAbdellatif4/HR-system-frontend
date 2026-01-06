import { useState, useEffect } from 'react';

export function useDatePicker({ value, minDate }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [value]);

  const today = new Date();
  const minDateObj = minDate ? new Date(minDate) : null;
  const selectedDate = value ? new Date(value) : null;

  const handleDateClick = (day, year, month, onChange, onClose) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);
    const yearStr = clickedDate.getFullYear();
    const monthStr = String(clickedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(clickedDate.getDate()).padStart(2, '0');
    const isoString = `${yearStr}-${monthStr}-${dayStr}`;
    onChange(isoString);
    onClose();
  };

  const isDateDisabled = (day, year, month) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    if (minDateObj) {
      const minDateNormalized = new Date(minDateObj);
      minDateNormalized.setHours(0, 0, 0, 0);
      return date < minDateNormalized;
    }
    return false;
  };

  const isDateSelected = (day, year, month) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day, year, month) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const goToPreviousMonth = (year, month) => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = (year, month) => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return {
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
  };
}

