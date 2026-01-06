import React from 'react';
import { getVisiblePages } from './helpers';

export const Pagination = React.memo(function Pagination({
  total,
  currentPage,
  totalPages,
  currentLimit,
  loading,
  onPageChange,
  onLimitChange,
  handlePageChange
}) {
  if (total === 0 || totalPages === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-gray-200 bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {onLimitChange && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
            <span className="text-xs text-gray-700">Items per page:</span>
            <div className="relative">
              <select 
                value={String(currentLimit || 10)}
                onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
                disabled={loading}
                className="appearance-none border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 pr-8 sm:pr-10 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer touch-manipulation min-h-[44px] sm:min-h-[36px]"
              >
                {[5, 10, 20, 50, 100].map((limitValue) => (
                  <option key={limitValue} value={String(limitValue)}>{limitValue}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              Showing {(currentPage - 1) * currentLimit + 1} to {Math.min(currentPage * currentLimit, total)} of {total} items
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={() => handlePageChange(Number(currentPage) - 1)}
            disabled={Number(currentPage) <= 1 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 touch-manipulation min-h-[44px] sm:min-h-[38px] transition-all duration-150"
          >
            Previous
          </button>
          <div className="flex items-center space-x-1 overflow-x-auto">
            {getVisiblePages(currentPage, totalPages).map((pageNum, idx) => {
              if (pageNum === null) {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              const isActive = Number(currentPage) === Number(pageNum);
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(Number(pageNum))}
                  disabled={loading}
                  className={`px-3.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-[38px] min-w-[44px] sm:min-w-[38px] ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                      : 'text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => handlePageChange(Number(currentPage) + 1)}
            disabled={Number(currentPage) >= Number(totalPages) || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 touch-manipulation min-h-[44px] sm:min-h-[38px] transition-all duration-150"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

