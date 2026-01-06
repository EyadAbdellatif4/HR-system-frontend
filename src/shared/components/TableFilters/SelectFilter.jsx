import React from 'react';
import { Select, Option } from '@material-tailwind/react';

export const SelectFilter = React.memo(function SelectFilter({
  config,
  value,
  onChange,
  loading,
}) {
  const currentValue = value;
  const selectedValue = currentValue !== undefined && currentValue !== null ? String(currentValue) : '';
  const validOptions = Array.isArray(config.options) ? config.options : [];
  const matchingOption = validOptions.find(opt => String(opt.value) === selectedValue);
  const displayValue = matchingOption ? String(matchingOption.value) : '';

  return (
    <div className="w-full sm:min-w-[150px]">
      <Select
        key={`${config.key}-select-${validOptions.length}`}
        label={config.label}
        value={displayValue}
        onChange={(val) => {
          const newValue = val !== null && val !== undefined ? String(val) : '';
          onChange(config.key, newValue);
        }}
        disabled={loading}
      >
        {validOptions.map((option) => {
          const optionValue = String(option.value);
          return (
            <Option key={optionValue} value={optionValue}>
              {option.label || optionValue}
            </Option>
          );
        })}
      </Select>
    </div>
  );
});

