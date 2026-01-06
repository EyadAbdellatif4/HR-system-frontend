import { useState, useEffect, useRef } from 'react';

export function useDateRangeFilter({ config, dateRangePickerRefs }) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      dateRangePickerRefs.current[config.key] = containerRef.current;
    }
  }, [config.key, dateRangePickerRefs]);

  const formatDateRangeDisplay = (range) => {
    if (!range || (!range.from && !range.to)) return '';
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      if (typeof dateStr === 'string' && dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(dateStr);
    };
    
    if (range.from && range.to) {
      const fromDate = parseDate(range.from);
      const toDate = parseDate(range.to);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const fromStr = `${dayNames[fromDate.getDay()]}, ${monthNames[fromDate.getMonth()]} ${fromDate.getDate()}`;
      const toStr = `${dayNames[toDate.getDay()]}, ${monthNames[toDate.getMonth()]} ${toDate.getDate()}`;
      return `${fromStr} - ${toStr}`;
    }
    if (range.from) {
      const fromDate = parseDate(range.from);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `From: ${dayNames[fromDate.getDay()]}, ${monthNames[fromDate.getMonth()]} ${fromDate.getDate()}`;
    }
    return '';
  };

  return {
    showPicker,
    setShowPicker,
    containerRef,
    formatDateRangeDisplay,
  };
}

