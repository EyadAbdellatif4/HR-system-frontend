import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { Pagination } from './Pagination';
import { useDataTable } from './useDataTable';

export function DataTable({ 
  title, 
  data, 
  columns,
  pagination = { total: 0, page: 1, limit: 10, totalPages: 0 },
  onPageChange,
  onView,
  emptyMessage = 'No items found',
  expandedRowId = null,
  onExpandToggle,
  renderExpandedRow,
  loading = false,
  isFetching = false,
  limit,
  onLimitChange,
  sortBy,
  sortOrder,
  onSort,
}) {
  const {
    safeData,
    safeColumns,
    hasActionColumn,
    hasExpandableRows,
    hasSeparateExpandableColumn,
    colSpan,
    sortableColumns,
  } = useDataTable({ data, columns, onView, onExpandToggle, renderExpandedRow, onSort });

  const { total, page: currentPage, limit: paginationLimit, totalPages } = pagination;
  const currentLimit = limit !== undefined ? limit : paginationLimit;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange && !loading) {
      onPageChange(newPage);
    }
  };

  const handleSort = (columnKey) => {
    if (!onSort || loading) return;
    if (sortBy !== columnKey) {
      onSort(columnKey, 'ASC');
    } else if (sortOrder === 'ASC') {
      onSort(columnKey, 'DESC');
    } else if (sortOrder === 'DESC') {
      onSort(null, null);
    } else {
      onSort(columnKey, 'ASC');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {title} {total > 0 && <span className="text-blue-600 font-semibold ml-2">({total})</span>}
          </h3>
        </div>
      </div>
      
      <div className="relative">
        {isFetching && !loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50" style={{ minHeight: '200px' }}>
            <LoadingSpinner />
          </div>
        )}
        
        <MobileView
          data={safeData}
          columns={safeColumns}
          loading={loading}
          emptyMessage={emptyMessage}
          expandedRowId={expandedRowId}
          hasExpandableRows={hasExpandableRows}
          hasActionColumn={hasActionColumn}
          onExpandToggle={onExpandToggle}
          onView={onView}
          renderExpandedRow={renderExpandedRow}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          handleSort={handleSort}
          sortableColumns={sortableColumns}
        />
        
        <DesktopView
          data={safeData}
          columns={safeColumns}
          loading={loading}
          emptyMessage={emptyMessage}
          expandedRowId={expandedRowId}
          hasExpandableRows={hasExpandableRows}
          hasActionColumn={hasActionColumn}
          hasSeparateExpandableColumn={hasSeparateExpandableColumn}
          onExpandToggle={onExpandToggle}
          onView={onView}
          renderExpandedRow={renderExpandedRow}
          colSpan={colSpan}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          handleSort={handleSort}
        />
      </div>
      
      {safeData.length > 0 && totalPages > 0 && (
        <Pagination
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          currentLimit={currentLimit}
          loading={loading}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}

