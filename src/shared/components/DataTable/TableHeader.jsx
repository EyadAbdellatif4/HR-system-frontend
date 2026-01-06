import React from 'react';
import { getSortIcon } from './SortIcon';

export const TableHeader = React.memo(function TableHeader({ 
  columns, 
  hasActionColumn, 
  hasSeparateExpandableColumn,
  sortBy,
  sortOrder,
  onSort,
  handleSort,
  isColumnSortable
}) {
  return (
    <thead className="bg-gradient-to-r from-blue-50 to-gray-50">
      <tr>
        {columns.map((column) => {
          const isSortable = isColumnSortable(column);
          const hideOnMobile = column.hideOnMobile || false;
          const hideOnTablet = column.hideOnTablet || false;
          const isSorted = sortBy === column.key;
          return (
            <th
              key={column.key}
              className={`px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 ${hideOnMobile ? 'hidden md:table-cell' : ''} ${hideOnTablet ? 'hidden lg:table-cell' : ''} ${column.headerAlign === 'right' ? 'text-right' : 'text-left'} ${isSortable ? 'cursor-pointer hover:bg-blue-100 transition-colors duration-150' : ''} ${isSorted ? 'bg-blue-100' : ''}`}
              onClick={isSortable ? () => handleSort(column.key) : undefined}
            >
              <div className={`flex items-center gap-2 ${column.headerAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                <span className={isSorted ? 'text-blue-700' : ''}>{column.header}</span>
                {getSortIcon(column.key, column, sortBy, sortOrder, onSort, handleSort)}
              </div>
            </th>
          );
        })}
        {hasActionColumn && (
          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <span className="text-blue-700">Actions</span>
          </th>
        )}
        {hasSeparateExpandableColumn && (
          <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16 sm:w-20 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50"></th>
        )}
      </tr>
    </thead>
  );
});

