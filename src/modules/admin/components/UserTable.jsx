import React from 'react';
import { Typography, IconButton } from '@material-tailwind/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/shared/components/DataTable';
import { UserInlineDetail } from './UserInlineDetail';

function UserTableComponent({ 
  users, 
  pagination,
  onPageChange,
  expandedRowId,
  onExpandToggle,
  onUpdate,
  onDelete,
  loading,
  isFetching = false,
  onRefresh,
  limit,
  onLimitChange,
  sortBy,
  sortOrder,
  onSort,
}) {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const columns = [
    {
      key: 'name',
      header: 'User Name',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
            <span className="text-white text-sm font-bold">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Typography
              variant="small"
              className="text-gray-900 font-semibold text-sm"
            >
              {user.name}
            </Typography>
            <Typography
              variant="small"
              className="text-gray-500 text-xs mt-0.5 truncate"
            >
              {user.email}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      hideOnMobile: true,
      render: (user) => (
        <Typography variant="small" className="text-gray-700 text-sm break-all">
          {user.email}
        </Typography>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: false,
      render: (user) => {
        const roleName = user.role?.name || 'Unknown';
        const roleColors = {
          'Admin': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', icon: 'text-purple-600' },
          'User': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', icon: 'text-blue-600' },
          'Manager': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300', icon: 'text-indigo-600' },
          'Editor': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: 'text-green-600' },
        };
        const roleStyle = roleColors[roleName] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: 'text-gray-600' };
        
        return (
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${roleStyle.bg} ${roleStyle.border} border-2 shadow-sm`}>
              <ShieldCheckIcon className={`w-4 h-4 ${roleStyle.icon} flex-shrink-0`} />
              <span className={`text-xs font-bold uppercase tracking-wide ${roleStyle.text}`}>
                {roleName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className={`relative flex items-center justify-center ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
            {user.is_active ? (
              <div className="relative">
                <CheckCircleIcon className="h-6 w-6" />
                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20"></div>
              </div>
            ) : (
              <XCircleIcon className="h-6 w-6" />
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            user.is_active 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Actions',
      isExpandable: true,
      headerAlign: 'right',
      render: (user) => {
        const isExpanded = expandedRowId === user.id;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpandToggle(user.id);
              }}
              className={`h-9 w-9 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                isExpanded
                  ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-md'
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
        );
      },
    }
  ];

  const handleRenderExpandedRow = (user) => (
    <UserInlineDetail
      user={user}
      onSubmit={async (data) => {
        await onUpdate(user.id, data);
      }}
      onDelete={() => onDelete(user)}
      loading={loading}
      onCollapse={() => onExpandToggle(null)}
      onRefresh={onRefresh}
    />
  );

  return (
    <DataTable
      title="Users"
      data={users}
      columns={columns}
      pagination={pagination}
      onPageChange={onPageChange}
      expandedRowId={expandedRowId}
      onExpandToggle={onExpandToggle}
      renderExpandedRow={handleRenderExpandedRow}
      emptyMessage="No users found"
      loading={loading}
      isFetching={isFetching}
      limit={limit}
      onLimitChange={onLimitChange}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  );
}

export const UserTable = React.memo(UserTableComponent);
export default UserTable;
