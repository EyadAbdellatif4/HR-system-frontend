import React from 'react';
import { Input } from '@material-tailwind/react';
import { DateRangePicker } from '../DateRangePicker';
import { useDateRangeFilter } from '@/common/hooks/useDateRangeFilter';

export const DateRangeFilter = React.memo(function DateRangeFilter({
  config,
  value,
  onChange,
  loading,
  dateRangePickerRefs,
}) {
  const {
    showPicker,
    setShowPicker,
    containerRef,
    formatDateRangeDisplay,
  } = useDateRangeFilter({ config, dateRangePickerRefs });

  return (
    <div 
      className="w-full sm:min-w-[250px] relative"
      ref={containerRef}
    >
      <Input
        type="text"
        label={config.label}
        value={formatDateRangeDisplay(value || { from: '', to: '' })}
        onFocus={() => setShowPicker(true)}
        readOnly
        disabled={loading}
        className="bg-card"
      />
      <DateRangePicker
        value={value || { from: '', to: '' }}
        onChange={(range) => {
          onChange(config.key, range);
          setShowPicker(false);
        }}
        show={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </div>
  );
});

