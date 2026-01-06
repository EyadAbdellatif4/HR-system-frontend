import React, { useState } from 'react';
import { X, Save, Loader2, User } from 'lucide-react';
import { SimpleDropdown } from './SimpleDropdown';
import { FileUpload } from './FileUpload';

/**
 * CreateUserModal Component
 * Modal for creating a new user
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onCreate - Function to handle user creation
 */
export function CreateUserModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    user_number: '',
    name: '',
    username: '',
    password: '',
    address: '',
    work_location: 'remote',
    role: 'user',
    social_insurance: false,
    medical_insurance: false,
    join_date: new Date().toISOString().split('T')[0],
    contract_date: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
    if (!formData.user_number || !formData.name || !formData.username || !formData.password || !formData.address || !formData.role) {
      if (window.showToast) {
        window.showToast('Please fill in all required fields', 'error');
      } else {
        alert('Please fill in all required fields');
      }
      return;
    }

    try {
      setIsSaving(true);
      await onCreate(formData, selectedFiles.length > 0 ? selectedFiles : null);
      onClose();
      // Reset form
      setFormData({
        user_number: '',
        name: '',
        username: '',
        password: '',
        address: '',
        work_location: 'remote',
        role: 'user',
        social_insurance: false,
        medical_insurance: false,
        join_date: new Date().toISOString().split('T')[0],
        contract_date: '',
      });
      setSelectedFiles([]);
      setImagePreview(null);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create employee. Please try again.';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Employee
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Add a new employee to the system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="user_number"
                value={formData.user_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email/Username <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Location
              </label>
              <SimpleDropdown
                options={[
                  { value: 'remote', label: 'Remote' },
                  { value: 'in-office', label: 'In Office' },
                  { value: 'hybrid', label: 'Hybrid' },
                ]}
                value={formData.work_location}
                onChange={(value) => handleInputChange({ target: { name: 'work_location', value } })}
                placeholder="Select Work Location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <SimpleDropdown
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'User' },
                ]}
                value={formData.role}
                onChange={(value) => handleInputChange({ target: { name: 'role', value } })}
                placeholder="Select Role"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Date
              </label>
              <input
                type="date"
                name="join_date"
                value={formData.join_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Date
              </label>
              <input
                type="date"
                name="contract_date"
                value={formData.contract_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="social_insurance"
                  checked={formData.social_insurance}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Social Insurance</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="medical_insurance"
                  checked={formData.medical_insurance}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Medical Insurance</label>
              </div>
            </div>

            {/* Profile Image Upload */}
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

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;

