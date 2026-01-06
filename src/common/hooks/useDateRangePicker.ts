import { useState, useEffect } from 'react';

export function useDateRangePicker({ value, onChange, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = value?.from ? new Date(value.from) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  useEffect(() => {
    if (!value || (!value.from && !value.to)) {
      setTempStartDate(null);
      setTempEndDate(null);
      setSelectingStart(true);
      return;
    }
    
    if (value?.from) {
      const date = new Date(value.from);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    if (value?.from && value?.to) {
      setSelectingStart(false);
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        if (typeof dateStr === 'string' && dateStr.includes('-')) {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        }
        return new Date(dateStr);
      };
      setTempStartDate(parseDate(value.from));
      setTempEndDate(parseDate(value.to));
    } else {
      setSelectingStart(true);
      setTempStartDate(null);
      setTempEndDate(null);
    }
  }, [value]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const formatDateToISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    if (!date) return '';
    let d;
    if (typeof date === 'string' && date.includes('-')) {
      const [year, month, day] = date.split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(date);
    }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;
  };

  const handleDateClick = (day, year, month) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    const startDate = parseDate(value?.from);
    const currentStart = tempStartDate || startDate;

    if (selectingStart || !currentStart) {
      setTempStartDate(clickedDate);
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (clickedDate < currentStart) {
        setTempStartDate(clickedDate);
        setTempEndDate(currentStart);
      } else {
        setTempEndDate(clickedDate);
      }
    }
  };

  const handleOK = () => {
    const startDate = parseDate(value?.from);
    const endDate = parseDate(value?.to);
    const currentStart = tempStartDate || startDate;
    const currentEnd = tempEndDate || endDate;

    if (tempStartDate && tempEndDate) {
      const fromISO = formatDateToISO(tempStartDate);
      const toISO = formatDateToISO(tempEndDate);
      onChange({ from: fromISO, to: toISO });
      onClose();
    } else if (tempStartDate && currentEnd) {
      const fromISO = formatDateToISO(tempStartDate);
      const toISO = formatDateToISO(currentEnd);
      onChange({ from: fromISO, to: toISO });
      onClose();
    } else if (currentStart && tempEndDate) {
      const fromISO = formatDateToISO(currentStart);
      const toISO = formatDateToISO(tempEndDate);
      onChange({ from: fromISO, to: toISO });
      onClose();
    }
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setSelectingStart(true);
    onChange({ from: '', to: '' });
  };

  const handleCancel = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setSelectingStart(true);
    onClose();
  };

  const goToPreviousMonth = (year, month) => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = (year, month) => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isDateInRange = (day, year, month) => {
    const startDate = parseDate(value?.from);
    const endDate = parseDate(value?.to);
    const currentStart = tempStartDate || startDate;
    const currentEnd = tempEndDate || endDate;
    
    if (!currentStart || !currentEnd) return false;
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const startDateObj = new Date(currentStart);
    startDateObj.setHours(0, 0, 0, 0);
    const endDateObj = new Date(currentEnd);
    endDateObj.setHours(0, 0, 0, 0);
    return date >= startDateObj && date <= endDateObj;
  };

  const isDateSelected = (day, year, month) => {
    const startDate = parseDate(value?.from);
    const endDate = parseDate(value?.to);
    const currentStart = tempStartDate || startDate;
    const currentEnd = tempEndDate || endDate;
    
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    if (currentStart) {
      const startDateObj = new Date(currentStart);
      startDateObj.setHours(0, 0, 0, 0);
      if (date.getTime() === startDateObj.getTime()) return 'start';
    }
    if (currentEnd) {
      const endDateObj = new Date(currentEnd);
      endDateObj.setHours(0, 0, 0, 0);
      if (date.getTime() === endDateObj.getTime()) return 'end';
    }
    return false;
  };

  const getDisplayText = () => {
    const startDate = parseDate(value?.from);
    const endDate = parseDate(value?.to);
    const currentStart = tempStartDate || startDate;
    const currentEnd = tempEndDate || endDate;

    if (tempStartDate && tempEndDate) {
      return `${formatDateDisplay(tempStartDate)} - ${formatDateDisplay(tempEndDate)}`;
    }
    if (currentStart && currentEnd) {
      return `${formatDateDisplay(currentStart)} - ${formatDateDisplay(currentEnd)}`;
    }
    if (tempStartDate) {
      return `From: ${formatDateDisplay(tempStartDate)}`;
    }
    if (currentStart) {
      return `From: ${formatDateDisplay(currentStart)}`;
    }
    return 'Select date range';
  };

  const displayText = getDisplayText();

  return {
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
  };
}

