// Helper functions for DataTable

export const renderCellValue = (item, column) => {
  if (column.render) return column.render(item);
  
  const value = item[column.key];
  if (value == null) return 'N/A';
  if (typeof value === 'object') {
    if (value.name) return value.name;
    if (value.email) return value.email;
    if (value.id) return value.id;
    if (Array.isArray(value)) {
      return value.length > 0 ? value.map(v => typeof v === 'object' ? (v.name || v.id || JSON.stringify(v)) : v).join(', ') : 'N/A';
    }
    const str = JSON.stringify(value);
    return str.length > 50 ? str.substring(0, 50) + '...' : str;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

export const getVisiblePages = (currentPage, totalPages) => {
  const current = Number(currentPage);
  const total = Number(totalPages);
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, null, total];
  }
  
  if (current >= total - 3) {
    return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  }
  
  return [1, null, current - 1, current, current + 1, null, total];
};

export const isColumnSortable = (column, onSort) => {
  const nonSortableKeys = ['details', 'actions', 'view', 'status'];
  return onSort && !nonSortableKeys.includes(column.key) && column.sortable !== false;
};

