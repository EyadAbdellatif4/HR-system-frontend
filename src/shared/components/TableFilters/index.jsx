import React, { useEffect } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { SearchFilter } from './SearchFilter';
import { SelectFilter } from './SelectFilter';
import { DateFilter } from './DateFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { useTableFilters } from './useTableFilters';

export const TableFilters = React.memo(function TableFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  filterConfig = [],
  loading = false,
}) {
  const {
    searchInputRefs,
    cursorPositions,
    focusedInputKey,
    dateRangePickerRefs,
    hasActiveFilters,
    getClearedFilters,
  } = useTableFilters(filters, filterConfig);

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleClearFilters = () => {
    onClearFilters(getClearedFilters());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dateRangePickerRefs.current).forEach(key => {
        const ref = dateRangePickerRefs.current[key];
        if (ref && !ref.contains(event.target)) {
          // Close logic handled in DateRangeFilter component
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dateRangePickerRefs]);

  return (
    <Card className="mb-4">
      <CardBody className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3 sm:gap-4">
          {filterConfig.map((config) => {
            if (config.type === 'search') {
              return (
                <SearchFilter
                  key={config.key}
                  config={config}
                  value={filters[config.key]}
                  onChange={handleFilterChange}
                  loading={loading}
                  searchInputRefs={searchInputRefs}
                  cursorPositions={cursorPositions}
                  focusedInputKey={focusedInputKey}
                />
              );
            }

            if (config.type === 'select') {
              return (
                <SelectFilter
                  key={config.key}
                  config={config}
                  value={filters[config.key]}
                  onChange={handleFilterChange}
                  loading={loading}
                />
              );
            }

            if (config.type === 'date') {
              return (
                <DateFilter
                  key={config.key}
                  config={config}
                  value={filters[config.key]}
                  onChange={handleFilterChange}
                  loading={loading}
                />
              );
            }

            if (config.type === 'dateRange') {
              return (
                <DateRangeFilter
                  key={config.key}
                  config={config}
                  value={filters[config.key]}
                  onChange={handleFilterChange}
                  loading={loading}
                  dateRangePickerRefs={dateRangePickerRefs}
                />
              );
            }

            return null;
          })}

          {hasActiveFilters && (
            <Button
              variant="text"
              color="red"
              size="sm"
              onClick={handleClearFilters}
              disabled={loading}
              className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Clear Filters</span>
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
});

