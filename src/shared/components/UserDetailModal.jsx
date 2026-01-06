import React, { useState, useEffect } from 'react';
import { X, User, Save, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/env';
import { FileUpload } from './FileUpload';

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
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        user_number: user.user_number || '',
        title: user.title || '',
        address: user.address || '',
        work_location: user.work_location || '',
        personal_phone: user.personal_phone || '',
        social_insurance: user.social_insurance || false,
        medical_insurance: user.medical_insurance || false,
        join_date: user.join_date || '',
        contract_date: user.contract_date || '',
        exit_date: user.exit_date || '',
        is_active: user.is_active !== false,
      });
      setIsEditing(false);
      setImageError(false);
    }
  }, [user]);

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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Filter out fields that backend doesn't accept in update DTO
      const { username, email, is_active, ...updateData } = formData;
      
      // Handle personal_phone as array if it's a string
      if (updateData.personal_phone && typeof updateData.personal_phone === 'string') {
        updateData.personal_phone = updateData.personal_phone
          .split(',')
          .map(phone => phone.trim())
          .filter(phone => phone);
      }
      
      // Pass files to onUpdate if any are selected
      await onUpdate(user.id, updateData, selectedFiles.length > 0 ? selectedFiles : null);
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
    const userImage = user?.attachments?.[0]?.path_URL;
    if (userImage) {
      return `${getApiUrl()}/files/${userImage}`;
    }
    return null;
  };

  const userImageUrl = getUserImageUrl();
  const hasImage = (imagePreview || userImageUrl) && !imageError;
  const displayImage = imagePreview || userImageUrl;

  if (!isOpen || !user) return null;

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
                {user.name || 'User Details'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {user.email || user.username || 'N/A'} • {user.user_number || 'N/A'}
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
                    setFormData({
                      name: user.name || '',
                      username: user.username || '',
                      email: user.email || '',
                      user_number: user.user_number || '',
                      title: user.title || '',
                      address: user.address || '',
                      work_location: user.work_location || '',
                      personal_phone: Array.isArray(user.personal_phone) ? user.personal_phone.join(', ') : (user.personal_phone || ''),
                      social_insurance: user.social_insurance || false,
                      medical_insurance: user.medical_insurance || false,
                      join_date: user.join_date || '',
                      contract_date: user.contract_date || '',
                      exit_date: user.exit_date || '',
                      is_active: user.is_active !== false,
                    });
                    setSelectedFiles([]);
                    setImagePreview(null);
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
                    {user.name || 'N/A'}
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
                    {user.username || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {user.email || 'N/A'}
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
                    {user.user_number || 'N/A'}
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
                    {user.title || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.is_active !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active !== false ? 'Active' : 'Inactive'}
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
                    {user.address || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                {isEditing ? (
                  <select
                    name="work_location"
                    value={formData.work_location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Location</option>
                    <option value="remote">Remote</option>
                    <option value="office">Office</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {user.work_location || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="personal_phone"
                    value={Array.isArray(formData.personal_phone) ? formData.personal_phone.join(', ') : (formData.personal_phone || '')}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone numbers, comma-separated"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {Array.isArray(user.personal_phone) ? user.personal_phone.join(', ') : (user.personal_phone || 'N/A')}
                  </p>
                )}
              </div>

              {/* Profile Image Upload */}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {user.join_date || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="contract_date"
                    value={formData.contract_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {user.contract_date || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exit Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="exit_date"
                    value={formData.exit_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {user.exit_date || 'N/A'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;

