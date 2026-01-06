import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

export const getSortIcon = (columnKey, column, sortBy, sortOrder, onSort, handleSort) => {
  const nonSortableKeys = ['details', 'actions', 'view', 'status'];
  if (!onSort || nonSortableKeys.includes(columnKey) || column?.sortable === false) return null;
  
  const isCurrentSort = sortBy === columnKey;
  const isAsc = isCurrentSort && sortOrder === 'ASC';
  const isDesc = isCurrentSort && sortOrder === 'DESC';
  
  let IconComponent, iconColor;
  if (isAsc) {
    IconComponent = ArrowUpIcon;
    iconColor = 'text-blue-600';
  } else if (isDesc) {
    IconComponent = ArrowDownIcon;
    iconColor = 'text-blue-600';
  } else {
    IconComponent = ArrowsUpDownIcon;
    iconColor = 'text-gray-400 hover:text-blue-500';
  }
  
  return (
    <div className="inline-flex ml-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleSort(columnKey); }}>
      <IconComponent className={`h-4 w-4 ${iconColor}`} />
    </div>
  );
};

