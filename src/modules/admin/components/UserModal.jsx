import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
  Input,
  Spinner,
  Alert,
  Chip,
} from '@material-tailwind/react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useUserModal } from '@/modules/admin/hooks';

export function UserModal({
  isOpen,
  onClose,
  user,
  isEditing,
  isCreating,
  onSubmit,
  loading,
  onDelete,
  onEditStart,
  onEditCancel,
  onRefresh,
}) {
  const {
    formData,
    setFormData,
    validationErrors,
    modalError,
    roles,
    loadingRoles,
    projects,
    loadingProjects,
    selectedProjects,
    setSelectedProjects,
    assigningProjects,
    handleSubmit,
    handleCancelEdit,
  } = useUserModal({ user, isOpen, isCreating, isEditing, onSubmit, onEditCancel, onRefresh });

  const title = isCreating
    ? 'Create New User'
    : isEditing
    ? 'Edit User'
    : 'User Details';

  return (
    <Dialog open={isOpen} handler={onClose} size="md" className="w-full max-w-full sm:max-w-md">
      <DialogHeader>
        <Typography variant="h5" className="text-text-primary text-lg sm:text-xl">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="p-4 sm:p-6">
        {modalError && (
          <Alert color="red" className="mb-4">
            {modalError}
          </Alert>
        )}

        {loading && !formData.name ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : isCreating || isEditing ? (
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Input
                label="Name "
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!validationErrors.name}
                required
              />
              {validationErrors.name && (
                <Typography variant="small" color="red" className="mt-1">
                  {validationErrors.name}
                </Typography>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email "
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={!!validationErrors.email}
                required
                disabled={isEditing}
              />
              {validationErrors.email && (
                <Typography variant="small" color="red" className="mt-1">
                  {validationErrors.email}
                </Typography>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                label={isEditing ? 'Password (Leave empty to keep current) ' : 'Password '}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!validationErrors.password}
                required={!isEditing}
              />
              {validationErrors.password && (
                <Typography variant="small" color="red" className="mt-1">
                  {validationErrors.password}
                </Typography>
              )}
            </div>

            {/* Role */}
            <div>
              <Typography variant="small" className="mb-2 text-text-primary font-medium">
                Role {!isEditing && '*'}
              </Typography>
              {loadingRoles ? (
                <div className="relative">
                  <div className="w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-card px-3 py-2.5 text-sm text-text-primary border border-gray-200 shadow-sm">
                    <span className="truncate">Loading...</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Spinner size="sm" />
                  </div>
                </div>
              ) : (
                <Menu as="div" className="relative inline-block w-full">
                  <Menu.Button
                    disabled={loading}
                    className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-card px-3 py-2.5 text-sm text-text-primary border border-gray-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      validationErrors.role_id ? '!border-red-500' : ''
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="truncate">
                      {formData.role_id
                        ? roles.find(r => r.id === formData.role_id)?.name || 'Select a role'
                        : 'Select a role'}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-text-secondary" />
                  </Menu.Button>
                  <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto"
                  >
                    <div className="py-1">
                      {roles.length === 0 ? (
                        <Menu.Item disabled>
                          <span className="block px-4 py-2 text-sm text-text-secondary">
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
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  focus
                                    ? 'bg-primary-50 text-primary-900'
                                    : 'text-text-primary hover:bg-gray-50'
                                } ${formData.role_id === role.id ? 'font-semibold' : ''}`}
                              >
                                {role.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>
                  </Menu.Items>
                </Menu>
              )}
              {validationErrors.role_id && (
                <Typography variant="small" color="red" className="mt-1">
                  {validationErrors.role_id}
                </Typography>
              )}
            </div>

            {/* Status (only for editing) */}
            {isEditing && !isCreating && (
              <div>
                <Typography variant="small" className="mb-2 text-text-primary font-medium">
                  Status
                </Typography>
                <Menu as="div" className="relative inline-block w-full">
                  <Menu.Button
                    disabled={loading}
                    className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-card px-3 py-2.5 text-sm text-text-primary border border-gray-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="truncate">
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-text-secondary" />
                  </Menu.Button>
                  <Menu.Items
                    className="absolute right-0 z-[9999] mt-2 w-full origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                is_active: true,
                              });
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              focus
                                ? 'bg-primary-50 text-primary-900'
                                : 'text-text-primary hover:bg-gray-50'
                            } ${formData.is_active ? 'font-semibold' : ''}`}
                          >
                            Active
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                is_active: false,
                              });
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              focus
                                ? 'bg-primary-50 text-primary-900'
                                : 'text-text-primary hover:bg-gray-50'
                            } ${!formData.is_active ? 'font-semibold' : ''}`}
                          >
                            Inactive
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            )}

            {/* Projects */}
            <div>
              <Typography variant="small" className="mb-2 text-text-primary font-medium">
                Projects
              </Typography>
              {loadingProjects ? (
                <div className="relative">
                  <div className="w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-card px-3 py-2.5 text-sm text-text-primary border border-gray-200 shadow-sm">
                    <span className="truncate">Loading...</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Spinner size="sm" />
                  </div>
                </div>
              ) : (
                <Menu as="div" className="relative inline-block w-full">
                  <Menu.Button
                    disabled={loading}
                    className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-md bg-card px-3 py-2.5 text-sm text-text-primary border border-gray-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="truncate">
                      {selectedProjects.length
                        ? `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} selected`
                        : 'Select projects'}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-text-secondary" />
                  </Menu.Button>
                  <Menu.Items
                    className="absolute right-0 z-[9999] mt-2 w-full origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto"
                  >
                    <div className="py-1">
                      {projects.length === 0 ? (
                        <Menu.Item disabled>
                          <span className="block px-4 py-2 text-sm text-text-secondary">
                            No projects available
                          </span>
                        </Menu.Item>
                      ) : (
                        projects.map((project) => (
                          <Menu.Item key={project.id}>
                            {({ focus }) => (
                              <label
                                className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                                  focus ? 'bg-primary-50' : 'hover:bg-gray-50'
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
                                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary pointer-events-none"
                                />
                                <Typography variant="small" className={`text-text-primary ${selectedProjects.includes(project.id) ? 'font-semibold' : ''}`}>
                                  {project.name}
                                </Typography>
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
        ) : user ? (
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-1">
                Name
              </Typography>
              <Typography variant="h6" className="text-text-primary">
                {user.name}
              </Typography>
            </div>

            {/* Email */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-1">
                Email
              </Typography>
              <Typography variant="paragraph" color="gray">
                {user.email}
              </Typography>
            </div>

            {/* Role */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-2">
                Role
              </Typography>
              <Chip
                variant="gradient"
                color="blue"
                value={user.role?.name || 'Unknown'}
                className="w-fit text-sm py-2 px-3"
              />
            </div>

            {/* Status */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-2">
                Status
              </Typography>
              <Chip
                variant="gradient"
                color={user.is_active ? 'green' : 'red'}
                value={user.is_active ? 'Active' : 'Inactive'}
                className="w-fit text-sm py-2 px-3"
              />
            </div>

            {/* Projects */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-2">
                Assigned Projects
              </Typography>
              {user.projects && user.projects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.projects.map((project) => (
                    <Chip
                      key={project.id}
                      variant="gradient"
                      color="blue"
                      value={project.name}
                      className="text-sm py-2 px-3"
                    />
                  ))}
                </div>
              ) : (
                <Typography variant="paragraph" color="gray" className="text-sm">
                  No projects assigned
                </Typography>
              )}
            </div>

            {/* Created Date */}
            <div>
              <Typography variant="small" className="text-text-primary font-bold mb-1">
                Created At
              </Typography>
              <Typography variant="paragraph" color="gray" className="text-sm">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </div>
          </div>
        ) : null}
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2">
        {isCreating ? (
          <>
            <Button
              variant="gradient"
              color="blue"
              onClick={handleSubmit}
              disabled={loading || assigningProjects || !formData.name || !formData.email || !formData.role_id}
            >
              {loading || assigningProjects ? (loading ? 'Creating...' : 'Assigning Projects...') : 'Create'}
            </Button>
            <Button variant="outlined" className="text-text-primary" onClick={onClose}>
              Cancel
            </Button>
          </>
        ) : !isEditing ? (
          <>
            <Button
              variant="gradient"
              color="blue"
              onClick={onEditStart}
            >
              Edit
            </Button>
            <Button variant="gradient" color="red" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="outlined" className="text-text-primary" onClick={onClose}>
              Close
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="gradient"
              color="blue"
              onClick={handleSubmit}
              disabled={loading || assigningProjects}
            >
              {loading || assigningProjects ? (loading ? 'Saving...' : 'Assigning Projects...') : 'Save Changes'}
            </Button>
            <Button variant="outlined" className="text-text-primary" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
}

