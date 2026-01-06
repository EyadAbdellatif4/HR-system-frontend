import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { renderCellValue } from './helpers';
import { LoadingSpinner } from '../LoadingSpinner';

export const MobileView = React.memo(function MobileView({
  data,
  columns,
  loading,
  emptyMessage,
  expandedRowId,
  hasExpandableRows,
  hasActionColumn,
  onExpandToggle,
  onView,
  renderExpandedRow,
  sortBy,
  sortOrder,
  onSort,
  handleSort,
  sortableColumns
}) {
  return (
    <div className="block sm:hidden">
      {onSort && sortableColumns.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Sort by:</label>
            <div className="flex-1 relative">
              <select
                value={sortBy || ''}
                onChange={(e) => e.target.value ? handleSort(e.target.value) : onSort(null, null)}
                disabled={loading}
                className="w-full appearance-none border-2 border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer touch-manipulation min-h-[44px] font-medium shadow-sm hover:border-blue-400 transition-colors duration-150"
              >
                <option value="">None</option>
                {sortableColumns.map((col) => (
                  <option key={col.key} value={col.key}>{col.header}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            {sortBy && (
              <button
                onClick={() => handleSort(sortBy)}
                disabled={loading}
                className="px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm transition-all duration-150"
                title={sortOrder === 'ASC' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {sortOrder === 'ASC' ? (
                  <ArrowUpIcon className="h-5 w-5 text-blue-600" />
                ) : sortOrder === 'DESC' ? (
                  <ArrowDownIcon className="h-5 w-5 text-blue-600" />
                ) : (
                  <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-3 text-sm text-gray-500">Loading data...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm font-medium text-gray-600">{emptyMessage}</p>
            </div>
          </div>
        ) : (
          data.map((item, index) => {
            const isExpanded = expandedRowId === item.id;
            const firstColumn = columns[0];
            const firstColumnKey = firstColumn?.key || '';
            const isIdColumn = firstColumnKey.includes('invoice') || firstColumnKey.includes('id') || firstColumnKey.includes('number');
            
            // Get all visible columns (excluding expandable and hidden ones)
            const visibleColumns = columns.filter(col => !col.isExpandable && col.hideOnMobile !== true);
            
            // First column as title (if it's an ID/invoice number type)
            const titleColumn = isIdColumn && visibleColumns.length > 0 ? visibleColumns[0] : null;
            // All columns for the body - include title column in body if not used as title
            const bodyColumns = visibleColumns;
            
            // Determine which columns to show based on expand state
            // Show first 6 columns when collapsed, all when expanded
            const initialShowCount = 6;
            const columnsToShow = hasExpandableRows 
              ? (isExpanded ? bodyColumns : bodyColumns.slice(0, initialShowCount))
              : bodyColumns;
            const remainingColumnsCount = hasExpandableRows && !isExpanded 
              ? Math.max(0, bodyColumns.length - initialShowCount)
              : 0;
            
            return (
              <React.Fragment key={item.id}>
                {/* Card Container */}
                <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-lg border-blue-300' : 'hover:shadow-lg hover:border-blue-200'}`}>
                  {/* Card Header */}
                  {titleColumn && (
                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                            <h3 className="text-base font-bold text-blue-700 truncate">
                              {renderCellValue(item, titleColumn)}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Button - Always show when expandable rows are available */}
                        {hasExpandableRows && renderExpandedRow && (
                          <button
                            onClick={() => onExpandToggle(item.id)}
                            disabled={loading}
                            className={`flex-shrink-0 h-9 w-9 rounded-lg border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-200 shadow-sm ${
                              isExpanded
                                ? 'bg-blue-50 border-blue-400 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                            }`}
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>
                        )}
                        
                        {/* Expand/Collapse Button for remaining columns */}
                        {hasExpandableRows && !renderExpandedRow && remainingColumnsCount > 0 && (
                          <button
                            onClick={() => onExpandToggle(item.id)}
                            disabled={loading}
                            className="flex-shrink-0 h-9 w-9 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-150 shadow-sm"
                            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Expand/Collapse Button at top of body if no title column and expandable rows available */}
                    {!titleColumn && hasExpandableRows && renderExpandedRow && (
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => onExpandToggle(item.id)}
                          disabled={loading}
                          className={`h-9 w-9 rounded-lg border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-200 shadow-sm ${
                            isExpanded
                              ? 'bg-blue-50 border-blue-400 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                          }`}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    )}
                    {/* Show columns in a grid - skip title column if it's shown in header */}
                    {columnsToShow.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {columnsToShow
                          .filter(col => !titleColumn || col.key !== titleColumn.key) // Skip title column if shown in header
                          .map((column) => {
                            const value = renderCellValue(item, column);
                            
                            return (
                              <div key={column.key} className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                  {column.header}
                                </span>
                                <span className="text-sm text-gray-900 font-medium break-words">
                                  {value !== null && value !== undefined && value !== '' ? value : 'N/A'}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Show remaining count indicator */}
                    {remainingColumnsCount > 0 && (
                      <div className="flex items-center justify-center mb-4">
                        <button
                          onClick={() => onExpandToggle(item.id)}
                          className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:underline py-2"
                        >
                          Show {remainingColumnsCount} more {remainingColumnsCount === 1 ? 'field' : 'fields'}
                        </button>
                      </div>
                    )}

                    {/* Expanded additional fields */}
                    {hasExpandableRows && isExpanded && remainingColumnsCount > 0 && (
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        {bodyColumns
                          .slice(initialShowCount)
                          .filter(col => !titleColumn || col.key !== titleColumn.key) // Skip title column if shown in header
                          .map((column) => {
                          const value = renderCellValue(item, column);
                          
                          return (
                            <div key={column.key} className="flex flex-col pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                {column.header}
                              </span>
                              <span className="text-sm text-gray-900 break-words">
                                {value !== null && value !== undefined && value !== '' ? value : 'N/A'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Render custom expanded row if provided and expanded */}
                    {hasExpandableRows && isExpanded && renderExpandedRow && (
                      <div className={`mt-4 pt-4 border-t-2 border-blue-200 bg-blue-50/30 rounded-lg p-4 ${remainingColumnsCount > 0 ? '' : 'border-t border-gray-100'}`}>
                        {renderExpandedRow(item)}
                      </div>
                    )}

                    {/* View Action Button */}
                    {hasActionColumn && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => !loading && onView(item.id)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg text-sm font-semibold touch-manipulation min-h-[44px] transition-all duration-150 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View Full Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
});

