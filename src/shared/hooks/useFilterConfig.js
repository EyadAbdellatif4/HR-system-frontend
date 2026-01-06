import { useMemo } from 'react';

export function useUsersFilterConfig(projects) {
  return useMemo(() => {
    const projectOptions = [
      { value: '', label: 'All Projects' },
      ...(Array.isArray(projects) && projects.length > 0 
        ? projects.map(p => ({ value: p?.name || '', label: p?.name || 'Unknown' }))
        : []),
    ];
    
    return [
      { type: 'search', key: 'search', label: 'Search' },
      {
        type: 'select',
        key: 'role',
        label: 'Role',
        options: [
          { value: '', label: 'All Roles' },
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
          { value: 'serviceAPI', label: 'Service API' },
        ],
        defaultValue: '',
      },
      {
        type: 'select',
        key: 'is_active',
        label: 'Status',
        options: [
          { value: '', label: 'All Status' },
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ],
        defaultValue: '',
      },
      { type: 'limit', key: 'limit' },
    ];
  }, [projects]);
}

