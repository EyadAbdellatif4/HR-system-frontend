import { useMemo } from 'react';

export function useDataTable({ data, columns, onView, onExpandToggle, renderExpandedRow, onSort }) {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  
  const hasActionColumn = !!onView;
  const hasExpandableRows = !!onExpandToggle && !!renderExpandedRow;
  const expandableColumn = safeColumns.find(col => col.isExpandable);
  const hasSeparateExpandableColumn = hasExpandableRows && !expandableColumn;

  const colSpan = safeColumns.length + (hasActionColumn ? 1 : 0) + (hasSeparateExpandableColumn ? 1 : 0);

  const sortableColumns = useMemo(() => {
    return safeColumns.filter(col => 
      onSort && 
      !['details', 'actions', 'view', 'status'].includes(col.key) && 
      col.sortable !== false
    );
  }, [safeColumns, onSort]);

  return {
    safeData,
    safeColumns,
    hasActionColumn,
    hasExpandableRows,
    hasSeparateExpandableColumn,
    colSpan,
    sortableColumns,
  };
}

