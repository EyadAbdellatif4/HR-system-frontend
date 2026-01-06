import React from 'react';
import {
  Typography,
  Input,
  Spinner,
  Alert,
} from '@material-tailwind/react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ShieldCheckIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { DeleteConfirmationDialog, InlineDetailActionBar } from '@/shared/components';
import { useUserInlineDetail } from '@/modules/admin/hooks';

export function UserInlineDetail({
  user,
  onSubmit,
  onDelete,
  loading,
  onCollapse,
  onRefresh,
}) {
  const {
    formData,
    setFormData,
    validationErrors,
    error,
    roles,
    loadingRoles,
    projects,
    loadingProjects,
    selectedProjects,
    setSelectedProjects,
    assigningProjects,
    showDeleteDialog,
    setShowDeleteDialog,
    handleSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
    getInitials,
  } = useUserInlineDetail({ user, onSubmit, onDelete, onCollapse, onRefresh, loading });

  return (
    <div className="bg-gradient-to-br from-blue-50/30 to-white rounded-lg p-4 sm:p-6">
      {error && (
        <Alert color="red" className="mb-6 animate-in fade-in duration-150">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-4 min-w-0">
          {/* User Information Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 overflow-hidden max-w-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
              <Typography variant="h6" className="text-gray-900 font-bold">
                User Information
              </Typography>
            </div>
            
            <div className="space-y-4 w-full min-w-0">
              {/* Avatar and Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 ring-4 ring-blue-100 shadow-md self-center sm:self-auto">
                  <span className="text-white text-xl font-bold">
                    {getInitials(formData.name)}
                  </span>
                </div>
                <div className="flex-1 w-full min-w-0 max-w-full">
                  <div className="w-full max-w-full">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      error={!!validationErrors.name}
                      required
                      className="!w-full !max-w-full"
                      containerProps={{ className: "!w-full !max-w-full min-w-0" }}
                    />
                    {validationErrors.name && (
                      <Typography variant="small" color="red" className="mt-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {validationErrors.name}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full min-w-0 max-w-full">
                <label className="flex items-center gap-2 mb-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                  <Typography variant="small" className="text-gray-700 font-semibold">
                    Email Address
                  </Typography>
                </label>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  error={!!validationErrors.email}
                  required
                  readOnly
                  className="cursor-not-allowed bg-gray-50 !w-full !max-w-full"
                  containerProps={{ className: "!w-full !max-w-full min-w-0" }}
                  onPointerDown={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.preventDefault()}
                />
                <Typography variant="small" className="mt-1.5 text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Email cannot be changed for security reasons
                </Typography>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  User ID
                </label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <Typography variant="small" className="text-gray-700 font-mono text-xs break-all">
                    {user?.id || 'N/A'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Assignment Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 max-w-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <Typography variant="h6" className="text-gray-900 font-bold">
                Project Assignment
              </Typography>
            </div>
            
            <div className="w-full min-w-0 max-w-full relative">
              {loadingProjects ? (
                <div className="relative">
                  <Input
                    label="Projects"
                    value=""
                    readOnly
                    disabled
                    className=""
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Spinner size="sm" />
                  </div>
                </div>
              ) : (
                <Menu as="div" className="relative inline-block w-full">
                  <Menu.Button
                    disabled={loading}
                    className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-900 border-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'border-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FolderOpenIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>
                        {selectedProjects.length
                          ? `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} selected`
                          : 'Select projects'}
                      </span>
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-500 flex-shrink-0" />
                  </Menu.Button>
                  <Menu.Items
                    className="absolute right-0 z-[9999] mt-2 w-full origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto border border-gray-200"
                  >
                    <div className="py-1">
                      {projects.length === 0 ? (
                        <Menu.Item disabled>
                          <span className="block px-4 py-2 text-sm text-gray-500">
                            No projects available
                          </span>
                        </Menu.Item>
                      ) : (
                        projects.map((project) => (
                          <Menu.Item key={project.id}>
                            {({ focus }) => (
                              <label
                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                                  focus ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (selectedProjects.includes(project.id)) {
                                    setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                  } else {
                                    setSelectedProjects([...selectedProjects, project.id]);
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedProjects.includes(project.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    if (e.target.checked) {
                                      setSelectedProjects([...selectedProjects, project.id]);
                                    } else {
                                      setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                                />
                                {project.logo_url && (
                                  <img 
                                    src={project.logo_url}
                                    alt=""
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                                <Typography variant="small" className={`text-gray-900 ${selectedProjects.includes(project.id) ? 'font-semibold' : ''}`}>
                                  {project.name}
                                </Typography>
                                {selectedProjects.includes(project.id) && (
                                  <svg className="ml-auto w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </label>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Security & Role */}
        <div className="space-y-4 min-w-0">
          {/* Security Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 overflow-hidden max-w-full">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
              <Typography variant="h6" className="text-gray-900 font-bold">
                Security Settings
              </Typography>
            </div>
            
            <div className="space-y-3 w-full min-w-0 max-w-full">
              <div className="w-full min-w-0 max-w-full">
                <label className="flex items-center gap-2 mb-2.5">
                  <LockClosedIcon className="w-4 h-4 text-gray-600" />
                  <Typography variant="small" className="text-gray-700 font-semibold">
                    Password
                  </Typography>
                </label>
                <Input
                  placeholder="Leave empty to keep current password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={!!validationErrors.password}
                  className="!w-full !max-w-full"
                  containerProps={{ className: "!w-full !max-w-full min-w-0" }}
                />
                {validationErrors.password && (
                  <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.password}
                  </Typography>
                )}
              </div>
              <Typography variant="small" className="text-gray-500 text-xs flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Password must be at least 6 characters long
              </Typography>
            </div>
          </div>

          {/* Role Assignment Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 overflow-visible max-w-full relative" style={{ zIndex: 1 }}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <Typography variant="h6" className="text-gray-900 font-bold">
                Role & Permissions
              </Typography>
            </div>
            
            <div className="space-y-4 w-full min-w-0">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <ShieldCheckIcon className="w-4 h-4 text-gray-600" />
                  <Typography variant="small" className="text-gray-700 font-semibold">
                    User Role
                  </Typography>
                </label>
                {loadingRoles ? (
                  <div className="relative">
                    <Input
                      label="Role"
                      value=""
                      readOnly
                      disabled
                      error={!!validationErrors.role_id}
                      className=""
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Spinner size="sm" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-w-0 max-w-full relative" style={{ zIndex: 1 }}>
                    <Menu as="div" className="relative inline-block w-full max-w-full">
                      <Menu.Button
                        disabled={loading}
                        className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-900 border-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          validationErrors.role_id ? '!border-red-500' : 'border-gray-300'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="truncate">
                          {formData.role_id
                            ? roles.find(r => r.id === formData.role_id)?.name || 'Select a role'
                            : 'Select a role'}
                        </span>
                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-500" />
                      </Menu.Button>
                      <Menu.Items
                        className="absolute right-0 z-[9999] mt-2 w-full origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto border border-gray-200"
                        style={{ position: 'absolute', zIndex: 9999 }}
                      >
                      <div className="py-1">
                        {roles.length === 0 ? (
                          <Menu.Item disabled>
                            <span className="block px-4 py-2 text-sm text-gray-500">
                              No roles available
                            </span>
                          </Menu.Item>
                        ) : (
                          roles.map((role) => (
                            <Menu.Item key={role.id}>
                              {({ focus }) => (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, role_id: role.id });
                                    if (validationErrors.role_id) {
                                      setValidationErrors({ ...validationErrors, role_id: null });
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                                    focus
                                      ? 'bg-blue-50 text-blue-900'
                                      : 'text-gray-900 hover:bg-gray-50'
                                  } ${formData.role_id === role.id ? 'font-semibold bg-blue-50' : ''}`}
                                >
                                  <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                                  <span>{role.name}</span>
                                  {formData.role_id === role.id && (
                                    <svg className="ml-auto w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              )}
                            </Menu.Item>
                          ))
                        )}
                      </div>
                    </Menu.Items>
                  </Menu>
                  </div>
                )}
                {validationErrors.role_id && (
                  <Typography variant="small" color="red" className="mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors.role_id}
                  </Typography>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Current Role
                </label>
                <div className="px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <Typography variant="small" className="text-blue-700 font-semibold">
                    {user?.role?.name || 'N/A'}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Bottom Action Bar */}
      <InlineDetailActionBar
        statusLabel="User Status"
        isActive={formData.is_active}
        onStatusToggle={() =>
          setFormData({ ...formData, is_active: !formData.is_active })
        }
        onUpdate={handleSubmit}
        onDelete={handleDeleteClick}
        loading={loading}
        updateDisabled={assigningProjects || !formData.name || !formData.role_id}
        assigningText={assigningProjects ? 'Assigning Projects...' : undefined}
      />
  
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        itemToDelete={user}
        itemName="user"
        itemNameField="name"
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  );  
}

