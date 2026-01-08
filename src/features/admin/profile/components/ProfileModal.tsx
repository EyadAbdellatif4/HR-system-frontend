import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getApiUrl } from '@/config/env';
import { FileUpload, SimpleDropdown, SimpleDatePicker } from '@/common/components';
import { useProfileModal } from '../hooks/useProfileModal';
import { departmentService } from '@/features/admin/users/services';

export function ProfileModal({
  isOpen,
  onClose,
  profileData,
  onSubmit,
  loading,
}) {
  const {
    formData,
    setFormData,
    validationErrors,
    modalError,
    handleSubmit,
    handleCancel,
    selectedFiles,
    imagePreview,
    handleFileChange,
    handleRemoveImage,
  } = useProfileModal({ profileData, isOpen, onSubmit });

  const getUserImageUrl = () => {
    // profileData might not have attachments, check if it's passed separately
    const userImage = profileData?.attachments?.[0]?.path_URL;
    if (userImage) {
      return `${getApiUrl()}/files/${userImage}`;
    }
    return null;
  };

  const userImageUrl = getUserImageUrl();
  const [imageError, setImageError] = React.useState(false);
  const hasImage = (imagePreview || userImageUrl) && !imageError;
  const displayImage = imagePreview || userImageUrl;

  // Helper function to get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Work location options
  const workLocationOptions = [
    { value: '', label: 'Select Location' },
    { value: 'remote', label: 'Remote' },
    { value: 'office', label: 'Office' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  // Handle personal phone as array
  const phoneArray = Array.isArray(formData.personal_phone) 
    ? formData.personal_phone 
    : (formData.personal_phone ? [formData.personal_phone] : []);

  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      personal_phone: [...phoneArray, '']
    }));
  };

  const handleRemovePhone = (index) => {
    setFormData(prev => ({
      ...prev,
      personal_phone: phoneArray.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneChange = (index, value) => {
    setFormData(prev => {
      const phones = [...phoneArray];
      phones[index] = value;
      return { ...prev, personal_phone: phones };
    });
  };

  // Date picker refs and state
  const joinDateRef = useRef(null);
  const contractDateRef = useRef(null);
  const exitDateRef = useRef(null);
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);
  const [showContractDatePicker, setShowContractDatePicker] = useState(false);
  const [showExitDatePicker, setShowExitDatePicker] = useState(false);

  // Departments state
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const deptData = await departmentService.getAllDepartments({ limit: 100, is_active: true });
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    if (isOpen) {
      fetchDepartments();
      // Initialize selected department IDs from profileData
      const deptIds = profileData?.departments?.map(dept => dept.id || dept) || [];
      setSelectedDepartmentIds(deptIds);
    }
  }, [isOpen, profileData]);

  const handleAddDepartment = (departmentId) => {
    if (departmentId && !selectedDepartmentIds.includes(departmentId)) {
      setSelectedDepartmentIds(prev => [...prev, departmentId]);
    }
  };

  const handleRemoveDepartment = (departmentId) => {
    setSelectedDepartmentIds(prev => prev.filter(id => id !== departmentId));
  };

  if (!isOpen || !profileData) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            {hasImage ? (
              <div className="relative">
                <img
                  src={displayImage}
                  alt={profileData.name || 'User'}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md"
                  onError={() => setImageError(true)}
                />
                {imagePreview && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-blue-600 text-xl font-bold">
                  {getInitials(profileData.name || 'U')}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {profileData.username || 'N/A'} • {profileData.user_number || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  // Include department_ids in submit
                  await handleSubmit(e, { department_ids: selectedDepartmentIds });
                  // Only close if no error (handleSubmit throws on error)
                  onClose();
                } catch (err) {
                  // Error is already handled in handleSubmit, modal stays open
                }
              }}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed order-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                handleCancel();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 hover:rotate-90 order-last"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {modalError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{modalError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (validationErrors.name) {
                      setFormData({ ...formData, name: e.target.value });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Number</label>
                <input
                  type="text"
                  name="user_number"
                  value={formData.user_number}
                  onChange={(e) => setFormData({ ...formData, user_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                <SimpleDropdown
                  options={workLocationOptions}
                  value={formData.work_location || ''}
                  onChange={(value) => setFormData({ ...formData, work_location: value })}
                  placeholder="Select Location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Phone</label>
                <div className="space-y-2">
                  {phoneArray.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Phone Number</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (validationErrors.password) {
                      setFormData({ ...formData, password: e.target.value });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Leave empty to keep current password"
                />
                {validationErrors.password && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <div ref={joinDateRef} className="relative">
                  <input
                    type="text"
                    value={formData.join_date || ''}
                    readOnly
                    onClick={() => setShowJoinDatePicker(!showJoinDatePicker)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    placeholder="Select join date"
                  />
                  {showJoinDatePicker && joinDateRef.current && createPortal(
                    <div
                      className="fixed z-[10001]"
                      style={{
                        bottom: `${window.innerHeight - joinDateRef.current.getBoundingClientRect().top + 4}px`,
                        left: `${joinDateRef.current.getBoundingClientRect().left}px`,
                      }}
                    >
                      <SimpleDatePicker
                        value={formData.join_date || ''}
                        onChange={(date) => {
                          setFormData({ ...formData, join_date: date });
                          setShowJoinDatePicker(false);
                        }}
                        show={showJoinDatePicker}
                        onClose={() => setShowJoinDatePicker(false)}
                      />
                    </div>,
                    document.body
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Date</label>
                <div ref={contractDateRef} className="relative">
                  <input
                    type="text"
                    value={formData.contract_date || ''}
                    readOnly
                    onClick={() => setShowContractDatePicker(!showContractDatePicker)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    placeholder="Select contract date"
                  />
                  {showContractDatePicker && contractDateRef.current && createPortal(
                    <div
                      className="fixed z-[10001]"
                      style={{
                        bottom: `${window.innerHeight - contractDateRef.current.getBoundingClientRect().top + 4}px`,
                        left: `${contractDateRef.current.getBoundingClientRect().left}px`,
                      }}
                    >
                      <SimpleDatePicker
                        value={formData.contract_date || ''}
                        onChange={(date) => {
                          setFormData({ ...formData, contract_date: date });
                          setShowContractDatePicker(false);
                        }}
                        show={showContractDatePicker}
                        onClose={() => setShowContractDatePicker(false)}
                      />
                    </div>,
                    document.body
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exit Date</label>
                <div ref={exitDateRef} className="relative">
                  <input
                    type="text"
                    value={formData.exit_date || ''}
                    readOnly
                    onClick={() => setShowExitDatePicker(!showExitDatePicker)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    placeholder="Select exit date"
                  />
                  {showExitDatePicker && exitDateRef.current && createPortal(
                    <div
                      className="fixed z-[10001]"
                      style={{
                        bottom: `${window.innerHeight - exitDateRef.current.getBoundingClientRect().top + 4}px`,
                        left: `${exitDateRef.current.getBoundingClientRect().left}px`,
                      }}
                    >
                      <SimpleDatePicker
                        value={formData.exit_date || ''}
                        onChange={(date) => {
                          setFormData({ ...formData, exit_date: date });
                          setShowExitDatePicker(false);
                        }}
                        show={showExitDatePicker}
                        onClose={() => setShowExitDatePicker(false)}
                      />
                    </div>,
                    document.body
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.social_insurance}
                      onChange={(e) => setFormData({ ...formData, social_insurance: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Social Insurance</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.medical_insurance}
                      onChange={(e) => setFormData({ ...formData, medical_insurance: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Medical Insurance</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
                <div className="space-y-2">
                  {selectedDepartmentIds.map((deptId) => {
                    const dept = departments.find(d => d.id === deptId);
                    return dept ? (
                      <div key={deptId} className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-900">{dept.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(deptId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                  <SimpleDropdown
                    options={[
                      { value: '', label: 'Select Department' },
                      ...departments
                        .filter(dept => !selectedDepartmentIds.includes(dept.id))
                        .map(dept => ({ value: dept.id, label: dept.name }))
                    ]}
                    value=""
                    onChange={(value) => {
                      if (value) handleAddDepartment(value);
                    }}
                    placeholder="Add Department"
                    loading={departmentsLoading}
                  />
                </div>
              </div>
            </div>

            {/* Profile Image Upload - Moved to end */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <FileUpload
                onFileChange={handleFileChange}
                accept="image/*"
                multiple={false}
                label="Click to upload or drag and drop"
                helperText="SVG, PNG, JPG or GIF (MAX. 800×400px)"
                previewUrl={imagePreview}
                onRemove={handleRemoveImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
