import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Save, Loader2, Calendar, Plus, Trash2 } from 'lucide-react';
import { getApiUrl } from '@/config/env';
import { FileUpload } from '@/common/components/FileUpload';
import { SimpleDatePicker } from '@/common/components/SimpleDatePicker';
import { SimpleDropdown } from '@/common/components/SimpleDropdown';
import { departmentService } from '../services';
import type { Department } from '@/types/api.types';

/**
 * UserDetailModal Component
 * Displays and allows editing of user details
 * 
 * @param {Object} props
 * @param {Object} props.user - The user object
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onUpdate - Function to handle user update
 */
export function UserDetailModal({ user, isOpen, onClose, onUpdate }) {
  const [currentUser, setCurrentUser] = useState(user); // Track current displayed user
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Departments state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);
  
  // Date picker states
  const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);
  const [showContractDatePicker, setShowContractDatePicker] = useState(false);
  const [showExitDatePicker, setShowExitDatePicker] = useState(false);
  const joinDateRef = useRef(null);
  const contractDateRef = useRef(null);
  const exitDateRef = useRef(null);
  const joinCalendarRef = useRef(null);
  const contractCalendarRef = useRef(null);
  const exitCalendarRef = useRef(null);

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
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUser(user); // Update current user when prop changes
      
      // Initialize personal_phone as array
      const phoneArray = Array.isArray(user.personal_phone) 
        ? user.personal_phone 
        : (user.personal_phone ? [user.personal_phone] : []);
      
      // Initialize department IDs
      const deptIds = user.departments?.map(dept => dept.id) || [];
      
      setFormData({
        name: user.name || '',
        username: user.username || '',
        user_number: user.user_number || '',
        title: user.title || '',
        address: user.address || '',
        work_location: user.work_location || '',
        personal_phone: phoneArray,
        social_insurance: user.social_insurance || false,
        medical_insurance: user.medical_insurance || false,
        join_date: user.join_date || '',
        contract_date: user.contract_date || '',
        exit_date: user.exit_date || '',
        is_active: user.is_active !== false,
      });
      setSelectedDepartmentIds(deptIds);
      setIsEditing(false);
      setImageError(false);
    }
  }, [user]);

  // Close date pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const isClickInJoinInput = joinDateRef.current?.contains(target);
      const isClickInJoinCalendar = joinCalendarRef.current?.contains(target);
      const isClickInContractInput = contractDateRef.current?.contains(target);
      const isClickInContractCalendar = contractCalendarRef.current?.contains(target);
      const isClickInExitInput = exitDateRef.current?.contains(target);
      const isClickInExitCalendar = exitCalendarRef.current?.contains(target);

      if (showJoinDatePicker && !isClickInJoinInput && !isClickInJoinCalendar) {
        setShowJoinDatePicker(false);
      }
      if (showContractDatePicker && !isClickInContractInput && !isClickInContractCalendar) {
        setShowContractDatePicker(false);
      }
      if (showExitDatePicker && !isClickInExitInput && !isClickInExitCalendar) {
        setShowExitDatePicker(false);
      }
    };

    if (showJoinDatePicker || showContractDatePicker || showExitDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showJoinDatePicker, showContractDatePicker, showExitDatePicker]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setSelectedFiles(files);
      // Create preview for first image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFiles([]);
    setImagePreview(null);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      personal_phone: [...(prev.personal_phone || []), '']
    }));
  };

  const handleRemovePhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personal_phone: prev.personal_phone.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    setFormData(prev => {
      const phones = [...(prev.personal_phone || [])];
      phones[index] = value;
      return { ...prev, personal_phone: phones };
    });
  };

  const handleAddDepartment = (departmentId: string) => {
    if (departmentId && !selectedDepartmentIds.includes(departmentId)) {
      setSelectedDepartmentIds(prev => [...prev, departmentId]);
    }
  };

  const handleRemoveDepartment = (departmentId: string) => {
    setSelectedDepartmentIds(prev => prev.filter(id => id !== departmentId));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Filter out fields that backend doesn't accept in update DTO
      // Note: username is now included in update (backend DTO updated)
      const { is_active, personal_phone, ...updateData } = formData;
      
      // Handle personal_phone as array - filter out empty strings
      const phoneArray = Array.isArray(personal_phone) 
        ? personal_phone.filter(phone => phone && phone.trim())
        : [];
      
      // Add department_ids to updateData
      const finalUpdateData = {
        ...updateData,
        personal_phone: phoneArray.length > 0 ? phoneArray : undefined,
        department_ids: selectedDepartmentIds.length > 0 ? selectedDepartmentIds : undefined,
      };
      
      // Pass files to onUpdate if any are selected
      const result = await onUpdate(user.id, finalUpdateData, selectedFiles.length > 0 ? selectedFiles : null);
      
      // Update currentUser with the response data or formData to reflect changes in UI
      if (result?.user) {
        setCurrentUser(result.user);
      } else {
        // Fallback: update currentUser with formData
        setCurrentUser(prev => ({
          ...prev,
          ...formData,
          username: formData.username || prev.username,
        }));
      }
      
      setIsEditing(false);
      setSelectedFiles([]);
      setImagePreview(null);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user. Please try again.';
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      
      if (window.showToast) {
        window.showToast(formattedError, 'error', 6000);
      } else {
        alert(formattedError);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getUserImageUrl = () => {
    const userImage = currentUser?.attachments?.[0]?.path_URL;
    if (userImage) {
      return `${getApiUrl()}/files/${userImage}`;
    }
    return null;
  };

  const userImageUrl = getUserImageUrl();
  const hasImage = (imagePreview || userImageUrl) && !imageError;
  const displayImage = imagePreview || userImageUrl;

  // Work location options
  const workLocationOptions = [
    { value: '', label: 'Select Location' },
    { value: 'remote', label: 'Remote' },
    { value: 'office', label: 'Office' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  // Status options
  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  if (!isOpen || !currentUser) return null;

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
                  alt={user.name || 'User'}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md"
                  onError={() => setImageError(true)}
                />
                {isEditing && imagePreview && (
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
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentUser.name || 'User Details'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentUser.username || 'N/A'} • {currentUser.user_number || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed order-1"
                >
                  {isSaving ? (
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
                    setIsEditing(false);
                    // Reset personal_phone as array
                    const phoneArray = Array.isArray(currentUser.personal_phone) 
                      ? currentUser.personal_phone 
                      : (currentUser.personal_phone ? [currentUser.personal_phone] : []);
                    
                    // Reset department IDs
                    const deptIds = currentUser.departments?.map(dept => dept.id) || [];
                    
                    setFormData({
                      name: currentUser.name || '',
                      username: currentUser.username || '',
                      user_number: currentUser.user_number || '',
                      title: currentUser.title || '',
                      address: currentUser.address || '',
                      work_location: currentUser.work_location || '',
                      personal_phone: phoneArray,
                      social_insurance: currentUser.social_insurance || false,
                      medical_insurance: currentUser.medical_insurance || false,
                      join_date: currentUser.join_date || '',
                      contract_date: currentUser.contract_date || '',
                      exit_date: currentUser.exit_date || '',
                      is_active: currentUser.is_active !== false,
                    });
                    setSelectedDepartmentIds(deptIds);
                    setSelectedFiles([]);
                    setImagePreview(null);
                    setShowJoinDatePicker(false);
                    setShowContractDatePicker(false);
                    setShowExitDatePicker(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors order-1"
              >
                Edit
              </button>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.name || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.username || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="user_number"
                    value={formData.user_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.user_number || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.title || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <SimpleDropdown
                    options={statusOptions}
                    value={String(formData.is_active)}
                    onChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'true' }))}
                    placeholder="Select Status"
                  />
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    currentUser.is_active !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentUser.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.address || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                {isEditing ? (
                  <SimpleDropdown
                    options={workLocationOptions}
                    value={formData.work_location || ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, work_location: value }))}
                    placeholder="Select Location"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {currentUser.work_location || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Phone</label>
                {isEditing ? (
                  <div className="space-y-2">
                    {(formData.personal_phone || []).map((phone, index) => (
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
                ) : (
                  <div className="space-y-1">
                    {Array.isArray(currentUser.personal_phone) && currentUser.personal_phone.length > 0 ? (
                      currentUser.personal_phone.map((phone, index) => (
                        <p key={index} className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {phone}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        N/A
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
                {isEditing ? (
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
                ) : (
                  <div className="space-y-1">
                    {currentUser.departments && currentUser.departments.length > 0 ? (
                      currentUser.departments.map((dept) => (
                        <p key={dept.id} className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {dept.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        N/A
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={joinDateRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                {isEditing ? (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={formatDateForDisplay(formData.join_date)}
                        onFocus={() => setShowJoinDatePicker(true)}
                        readOnly
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {showJoinDatePicker && joinDateRef.current && createPortal(
                      <div 
                        ref={joinCalendarRef}
                        className="fixed z-[10002]" 
                        style={{ 
                          left: joinDateRef.current.getBoundingClientRect().left,
                          bottom: window.innerHeight - joinDateRef.current.getBoundingClientRect().top + 4
                        }}
                      >
                        <SimpleDatePicker
                          value={formData.join_date}
                          onChange={(date) => {
                            handleDateChange('join_date', date);
                            setShowJoinDatePicker(false);
                          }}
                          show={showJoinDatePicker}
                          onClose={() => setShowJoinDatePicker(false)}
                        />
                      </div>,
                      document.body
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {formatDateForDisplay(currentUser.join_date) || 'N/A'}
                  </p>
                )}
              </div>

              <div className="relative" ref={contractDateRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Date</label>
                {isEditing ? (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={formatDateForDisplay(formData.contract_date)}
                        onFocus={() => setShowContractDatePicker(true)}
                        readOnly
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {showContractDatePicker && contractDateRef.current && createPortal(
                      <div 
                        ref={contractCalendarRef}
                        className="fixed z-[10002]" 
                        style={{ 
                          left: contractDateRef.current.getBoundingClientRect().left,
                          bottom: window.innerHeight - contractDateRef.current.getBoundingClientRect().top + 4
                        }}
                      >
                        <SimpleDatePicker
                          value={formData.contract_date}
                          onChange={(date) => {
                            handleDateChange('contract_date', date);
                            setShowContractDatePicker(false);
                          }}
                          show={showContractDatePicker}
                          onClose={() => setShowContractDatePicker(false)}
                        />
                      </div>,
                      document.body
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {formatDateForDisplay(currentUser.contract_date) || 'N/A'}
                  </p>
                )}
              </div>

              <div className="relative" ref={exitDateRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exit Date</label>
                {isEditing ? (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={formatDateForDisplay(formData.exit_date)}
                        onFocus={() => setShowExitDatePicker(true)}
                        readOnly
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {showExitDatePicker && exitDateRef.current && createPortal(
                      <div 
                        ref={exitCalendarRef}
                        className="fixed z-[10002]" 
                        style={{ 
                          left: exitDateRef.current.getBoundingClientRect().left,
                          bottom: window.innerHeight - exitDateRef.current.getBoundingClientRect().top + 4
                        }}
                      >
                        <SimpleDatePicker
                          value={formData.exit_date}
                          onChange={(date) => {
                            handleDateChange('exit_date', date);
                            setShowExitDatePicker(false);
                          }}
                          show={showExitDatePicker}
                          onClose={() => setShowExitDatePicker(false)}
                        />
                      </div>,
                      document.body
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {formatDateForDisplay(currentUser.exit_date) || 'N/A'}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="social_insurance"
                    checked={formData.social_insurance}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <label className="ml-2 text-sm text-gray-700">Social Insurance</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="medical_insurance"
                    checked={formData.medical_insurance}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <label className="ml-2 text-sm text-gray-700">Medical Insurance</label>
                </div>
              </div>

              {/* Profile Image Upload - Moved to end */}
              {isEditing && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;

