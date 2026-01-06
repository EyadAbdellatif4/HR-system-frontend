import React, { useState } from 'react';
import { X, Save, Loader2, Package } from 'lucide-react';
import { SimpleDropdown } from '@/common/components/SimpleDropdown';
import { FileUpload } from '@/common/components/FileUpload';

/**
 * CreateAssetModal Component
 * Modal for creating a new asset
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onCreate - Function to handle asset creation
 */
export function CreateAssetModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    label: '',
    type: '',
    asset_type: '',
    model: '',
    serial_number: '',
    status: 'Active',
    ram: '',
    laptop_processor: '',
    laptop_ssd: '',
    laptop_hdd: '',
    laptop_graphics_card: '',
    laptop_monitor: '',
    mobile_imei_1: '',
    mobile_imei_2: '',
    mobile_internal_memory: '',
    mobile_external_memory: '',
    phone_number: '',
    phone_company: '',
    phone_current_plan: '',
    phone_legal_owner: '',
    phone_comment: '',
    details: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.label || !formData.type || !formData.asset_type || !formData.model || !formData.serial_number || !formData.ram) {
      if (window.showToast) {
        window.showToast('Please fill in all required fields', 'error');
      } else {
        alert('Please fill in all required fields');
      }
      return;
    }

    try {
      setIsSaving(true);
      
      // Filter out empty fields before sending
      const cleanedData = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        // Always include ram since it's required and validated above
        // For other fields, only include non-empty values
        if (key === 'ram' || (value !== '' && value !== null && value !== undefined)) {
          cleanedData[key] = value;
        }
      });
      
      await onCreate(cleanedData, selectedFiles.length > 0 ? selectedFiles : null);
      onClose();
      // Reset form
      setFormData({
        label: '',
        type: '',
        asset_type: '',
        model: '',
        serial_number: '',
        status: 'Active',
        ram: '',
        laptop_processor: '',
        laptop_ssd: '',
        laptop_hdd: '',
        laptop_graphics_card: '',
        laptop_monitor: '',
        mobile_imei_1: '',
        mobile_imei_2: '',
        mobile_internal_memory: '',
        mobile_external_memory: '',
        phone_number: '',
        phone_company: '',
        phone_current_plan: '',
        phone_legal_owner: '',
        phone_comment: '',
        details: '',
      });
      setSelectedFiles([]);
      setImagePreview(null);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create asset. Please try again.';
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Asset
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Add a new asset to the system
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
                Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type <span className="text-red-500">*</span>
              </label>
              <SimpleDropdown
                options={[
                  { value: 'laptop', label: 'Laptop' },
                  { value: 'phone', label: 'Phone' },
                  { value: 'mobile', label: 'Mobile' },
                ]}
                value={formData.asset_type}
                onChange={(value) => handleDropdownChange('asset_type', value)}
                placeholder="Select Type"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <SimpleDropdown
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
                value={formData.status}
                onChange={(value) => handleDropdownChange('status', value)}
                placeholder="Select Status"
              />
            </div>

            {/* RAM Field - Required for all asset types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RAM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {formData.asset_type === 'laptop' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
                  <input
                    type="text"
                    name="laptop_processor"
                    value={formData.laptop_processor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SSD</label>
                  <input
                    type="text"
                    name="laptop_ssd"
                    value={formData.laptop_ssd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HDD</label>
                  <input
                    type="text"
                    name="laptop_hdd"
                    value={formData.laptop_hdd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graphics Card</label>
                  <input
                    type="text"
                    name="laptop_graphics_card"
                    value={formData.laptop_graphics_card}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monitor</label>
                  <input
                    type="text"
                    name="laptop_monitor"
                    value={formData.laptop_monitor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {(formData.asset_type === 'mobile' || formData.asset_type === 'phone') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMEI 1</label>
                  <input
                    type="text"
                    name="mobile_imei_1"
                    value={formData.mobile_imei_1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMEI 2</label>
                  <input
                    type="text"
                    name="mobile_imei_2"
                    value={formData.mobile_imei_2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Memory</label>
                  <input
                    type="text"
                    name="mobile_internal_memory"
                    value={formData.mobile_internal_memory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">External Memory</label>
                  <input
                    type="text"
                    name="mobile_external_memory"
                    value={formData.mobile_external_memory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {formData.asset_type === 'phone' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Company</label>
                  <input
                    type="text"
                    name="phone_company"
                    value={formData.phone_company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Plan</label>
                  <input
                    type="text"
                    name="phone_current_plan"
                    value={formData.phone_current_plan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legal Owner</label>
                  <input
                    type="text"
                    name="phone_legal_owner"
                    value={formData.phone_legal_owner}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Comment</label>
                  <textarea
                    name="phone_comment"
                    value={formData.phone_comment}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Asset Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Image</label>
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
                <span>Create Asset</span>
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

export default CreateAssetModal;

