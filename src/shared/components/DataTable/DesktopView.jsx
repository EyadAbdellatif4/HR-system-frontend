import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { renderCellValue } from './helpers';
import { LoadingSpinner } from '../LoadingSpinner';
import { TableHeader } from './TableHeader';
import { isColumnSortable } from './helpers';

export const DesktopView = React.memo(function DesktopView({
  data,
  columns,
  loading,
  emptyMessage,
  expandedRowId,
  hasExpandableRows,
  hasActionColumn,
  hasSeparateExpandableColumn,
  onExpandToggle,
  onView,
  renderExpandedRow,
  colSpan,
  sortBy,
  sortOrder,
  onSort,
  handleSort
}) {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full table-auto">
        <TableHeader
          columns={columns}
          hasActionColumn={hasActionColumn}
          hasSeparateExpandableColumn={hasSeparateExpandableColumn}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          handleSort={handleSort}
          isColumnSortable={(col) => isColumnSortable(col, onSort)}
        />
        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="px-4 lg:px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <LoadingSpinner />
                  <p className="mt-3 text-sm text-gray-500">Loading data...</p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-4 lg:px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const isExpanded = expandedRowId === item.id;
              return (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-blue-50/50 transition-colors duration-150 border-b border-gray-100">
                    {columns.map((column) => {
                      const hideOnMobile = column.hideOnMobile || false;
                      const hideOnTablet = column.hideOnTablet || false;
                      const isIdColumn = column.key === 'invoice_number' || column.key.includes('id') || column.key.includes('number');
                      return (
                        <td 
                          key={column.key} 
                          className={`px-4 lg:px-6 py-4 whitespace-nowrap text-sm ${hideOnMobile ? 'hidden md:table-cell' : ''} ${hideOnTablet ? 'hidden lg:table-cell' : ''} ${isIdColumn ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                        >
                          {column.render ? column.render(item) : renderCellValue(item, column)}
                        </td>
                      );
                    })}
                    {hasActionColumn && (
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!loading) onView(item.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-all duration-150"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"></path>
                          </svg>
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    )}
                    {hasSeparateExpandableColumn && (
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => onExpandToggle(item.id)}
                            disabled={loading}
                            className="h-8 w-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {hasExpandableRows && isExpanded && (
                    <tr className="bg-blue-50/30">
                      <td colSpan={colSpan} className="p-0 border-b border-gray-100">
                        <div className="px-6 py-4 border-l-4 border-blue-500">{renderExpandedRow(item)}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
});

