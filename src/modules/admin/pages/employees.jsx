import React, { useState, useEffect } from 'react';
import { User, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useUsers } from '@/modules/admin/hooks';
import { LoadingSpinner, UserDetailModal, CreateUserModal } from '@/shared/components';
import { userService } from '@/modules/admin/services';
import { getApiUrl } from '@/config/env';
import { useSearch } from '@/contexts/SearchContext';
import { useAppSelector, useAppDispatch } from '@/store';
import { openModal, closeModal } from '@/store/slices/modalSlice';

export function Employees() {
  const dispatch = useAppDispatch();
  const { 
    users, 
    loading, 
    error, 
    success, 
    pagination, 
    filters, 
    updateFilters, 
    updatePage, 
    updateUser,
    createUser,
    deleteUser,
    clearError, 
    clearSuccess 
  } = useUsers();

  const { searchQuery } = useSearch();
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [imageErrors, setImageErrors] = useState({});
  
  // Redux state
  const createUserModal = useAppSelector((state) => state.modal.createUser);
  const userDetailModal = useAppSelector((state) => state.modal.userDetail);

  // Sync search query from context with filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.search) {
        updateFilters({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleRowClick = async (user) => {
    // Fetch full user details
    try {
      const response = await userService.getUserById(user.id);
      const userData = response.user || user;
      dispatch(openModal({ modal: 'userDetail', data: userData }));
    } catch (err) {
      console.error('Error fetching user details:', err);
      // Use the user from the list if fetch fails
      dispatch(openModal({ modal: 'userDetail', data: user }));
    }
  };

  const handleUpdate = async (userId, updateData) => {
    try {
      await updateUser(userId, updateData);
      dispatch(closeModal('userDetail'));
    } catch (error) {
      console.error('Error updating user:', error);
      // Don't close modal on error so user can retry
    }
  };

  const handleCreate = async (data) => {
    await createUser(data);
    dispatch(closeModal('createUser'));
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.size} user(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedRows).map(userId => deleteUser(userId));
      await Promise.all(deletePromises);
      setSelectedRows(new Set());
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(users.map(user => user.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (userId) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const getUserImageUrl = (user) => {
    const userImage = user?.attachments?.[0]?.path_URL;
    if (userImage) {
      return `${getApiUrl()}/files/${userImage}`;
    }
    return null;
  };

  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
  };

  const getStatusColor = (isActive) => {
    if (isActive === true || isActive === 'true') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track company employees</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedRows.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete ({selectedRows.size})</span>
            </button>
          )}
          <button
            onClick={() => dispatch(openModal({ modal: 'createUser' }))}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}


      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No employees found</p>
            <p className="text-gray-400 text-sm mt-2">Get started by adding your first employee</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    const userImageUrl = getUserImageUrl(user);
                    const hasImage = userImageUrl && !imageErrors[user.id];
                    const userName = user.name || user.username || 'Unnamed User';
                    const isSelected = selectedRows.has(user.id);
                    const departmentName = user.departments?.[0]?.name || 'N/A';
                    const isActive = user.is_active !== false;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleRowClick(user)}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(user.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {hasImage ? (
                              <img
                                src={userImageUrl}
                                alt={userName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onError={() => handleImageError(user.id)}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900">{userName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.user_number || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {departmentName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.email || user.username || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(isActive)}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-200 bg-gray-50 gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Showing</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => updateFilters({ limit: parseInt(e.target.value), page: 1 })}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} out of {pagination.total} records
                  </span>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePage(pagination.page - 1);
                      }}
                      disabled={pagination.page === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePage(pageNum);
                            }}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePage(pagination.page + 1);
                      }}
                      disabled={pagination.page >= pagination.totalPages}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {userDetailModal.item && (
        <UserDetailModal
          user={userDetailModal.item}
          isOpen={userDetailModal.isOpen}
          onClose={() => dispatch(closeModal('userDetail'))}
          onUpdate={handleUpdate}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createUserModal.isOpen}
        onClose={() => dispatch(closeModal('createUser'))}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default Employees;

