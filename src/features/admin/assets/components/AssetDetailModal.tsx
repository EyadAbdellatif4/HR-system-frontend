import React, { useState, useEffect } from 'react';
import { X, Package, Save, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/env';
import { SimpleDropdown } from '@/common/components/SimpleDropdown';
import { FileUpload } from '@/common/components/FileUpload';

/**
 * AssetDetailModal Component
 * Displays and allows editing of asset details
 * 
 * @param {Object} props
 * @param {Object} props.asset - The asset object
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onUpdate - Function to handle asset update
 */
export function AssetDetailModal({ asset, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (asset) {
      setFormData({
        label: asset.label || '',
        type: asset.type || '',
        asset_type: asset.asset_type || '',
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        status: asset.status || '',
        ram: asset.ram || '',
        laptop_processor: asset.laptop_processor || '',
        laptop_ssd: asset.laptop_ssd || '',
        laptop_hdd: asset.laptop_hdd || '',
        laptop_graphics_card: asset.laptop_graphics_card || '',
        laptop_monitor: asset.laptop_monitor || '',
        mobile_imei_1: asset.mobile_imei_1 || '',
        mobile_imei_2: asset.mobile_imei_2 || '',
        mobile_internal_memory: asset.mobile_internal_memory || '',
        mobile_external_memory: asset.mobile_external_memory || '',
        phone_number: asset.phone_number || '',
        phone_company: asset.phone_company || '',
        phone_current_plan: asset.phone_current_plan || '',
        phone_legal_owner: asset.phone_legal_owner || '',
        phone_comment: asset.phone_comment || '',
        details: asset.details || '',
      });
      setIsEditing(false);
      setImageError(false);
    }
  }, [asset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, value) => {
    if (name === 'asset_type') {
      // When asset type changes, clear fields from other types
      const clearedData = {
        ...formData,
        [name]: value,
        // Clear laptop fields if not laptop
        ...(value !== 'laptop' ? {
          laptop_processor: '',
          laptop_ssd: '',
          laptop_hdd: '',
          laptop_graphics_card: '',
          laptop_monitor: '',
        } : {}),
        // Clear mobile/phone fields if not mobile or phone
        ...(value !== 'mobile' && value !== 'phone' ? {
          mobile_imei_1: '',
          mobile_imei_2: '',
          mobile_internal_memory: '',
          mobile_external_memory: '',
        } : {}),
        // Clear phone-specific fields if not phone
        ...(value !== 'phone' ? {
          phone_number: '',
          phone_company: '',
          phone_current_plan: '',
          phone_legal_owner: '',
          phone_comment: '',
        } : {}),
      };
      setFormData(clearedData);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    if (!formData.ram) {
      if (window.showToast) {
        window.showToast('RAM is required', 'error');
      } else {
        alert('RAM is required');
      }
      return;
    }

    try {
      setIsSaving(true);
      // Filter out empty fields and fields from other asset types
      const cleanedData = {};
      const assetType = formData.asset_type;
      
      // Define fields for each asset type
      const laptopFields = ['laptop_processor', 'laptop_ssd', 'laptop_hdd', 'laptop_graphics_card', 'laptop_monitor'];
      const mobileFields = ['mobile_imei_1', 'mobile_imei_2', 'mobile_internal_memory', 'mobile_external_memory'];
      const phoneFields = ['phone_number', 'phone_company', 'phone_current_plan', 'phone_legal_owner', 'phone_comment'];
      
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        // Always include ram since it's required
        if (key === 'ram') {
          cleanedData[key] = value;
          return;
        }
        
        // Filter out fields from other asset types
        if (assetType === 'laptop') {
          // Only include laptop fields, exclude mobile/phone fields
          if (mobileFields.includes(key) || phoneFields.includes(key)) {
            return; // Skip this field
          }
        } else if (assetType === 'mobile') {
          // Only include mobile fields, exclude laptop and phone-specific fields
          if (laptopFields.includes(key) || phoneFields.includes(key)) {
            return; // Skip this field
          }
        } else if (assetType === 'phone') {
          // Include mobile and phone fields, exclude laptop fields
          if (laptopFields.includes(key)) {
            return; // Skip this field
          }
        }
        
        // Only include non-empty values (empty strings, null, undefined are excluded)
        if (value !== '' && value !== null && value !== undefined) {
          cleanedData[key] = value;
        }
      });
      
      await onUpdate(asset.id, cleanedData, selectedFiles.length > 0 ? selectedFiles : null);
      setIsEditing(false);
      setSelectedFiles([]);
      setImagePreview(null);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update asset. Please try again.';
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

  const getAssetImageUrl = () => {
    const assetImage = asset?.attachments?.[0]?.path_URL;
    if (assetImage) {
      return `${getApiUrl()}/files/${assetImage}`;
    }
    return null;
  };

  const assetImageUrl = getAssetImageUrl();
  const hasImage = (imagePreview || assetImageUrl) && !imageError;
  const displayImage = imagePreview || assetImageUrl;

  if (!isOpen || !asset) return null;

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
                  alt={asset.label || 'Asset'}
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
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {asset.label || 'Asset Details'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {asset.type || 'N/A'} • {asset.model || 'N/A'}
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
                        label: asset.label || '',
                        type: asset.type || '',
                        asset_type: asset.asset_type || '',
                        model: asset.model || '',
                        serial_number: asset.serial_number || '',
                        status: asset.status || '',
                        ram: asset.ram || '',
                        laptop_processor: asset.laptop_processor || '',
                        laptop_ssd: asset.laptop_ssd || '',
                        laptop_hdd: asset.laptop_hdd || '',
                        laptop_graphics_card: asset.laptop_graphics_card || '',
                        laptop_monitor: asset.laptop_monitor || '',
                        mobile_imei_1: asset.mobile_imei_1 || '',
                        mobile_imei_2: asset.mobile_imei_2 || '',
                        mobile_internal_memory: asset.mobile_internal_memory || '',
                        mobile_external_memory: asset.mobile_external_memory || '',
                        phone_number: asset.phone_number || '',
                        phone_company: asset.phone_company || '',
                        phone_current_plan: asset.phone_current_plan || '',
                        phone_legal_owner: asset.phone_legal_owner || '',
                        phone_comment: asset.phone_comment || '',
                        details: asset.details || '',
                      });
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.label || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.type || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                {isEditing ? (
                  <SimpleDropdown
                    options={[
                      { value: 'laptop', label: 'Laptop' },
                      { value: 'phone', label: 'Phone' },
                      { value: 'mobile', label: 'Mobile' },
                    ]}
                    value={formData.asset_type}
                    onChange={(value) => handleDropdownChange('asset_type', value)}
                    placeholder="Select Type"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.asset_type || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.model || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.serial_number || 'N/A'}
                  </p>
                )}
              </div>

              {/* RAM Field - Required for all asset types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RAM <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ram"
                    value={formData.ram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {asset.ram || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <SimpleDropdown
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                    ]}
                    value={formData.status}
                    onChange={(value) => handleDropdownChange('status', value)}
                    placeholder="Select Status"
                  />
                ) : (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    asset.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status || 'N/A'}
                  </span>
                )}
              </div>
            </div>

            {/* Laptop Specific Fields */}
            {(formData.asset_type === 'laptop' || (!isEditing && asset.asset_type === 'laptop')) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Laptop Specifications
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="laptop_processor"
                      value={formData.laptop_processor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.laptop_processor || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SSD</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="laptop_ssd"
                      value={formData.laptop_ssd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.laptop_ssd || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HDD</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="laptop_hdd"
                      value={formData.laptop_hdd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.laptop_hdd || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graphics Card</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="laptop_graphics_card"
                      value={formData.laptop_graphics_card}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.laptop_graphics_card || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monitor</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="laptop_monitor"
                      value={formData.laptop_monitor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.laptop_monitor || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mobile/Phone Specific Fields */}
            {((isEditing && (formData.asset_type === 'mobile' || formData.asset_type === 'phone')) || 
              (!isEditing && (asset.asset_type === 'mobile' || asset.asset_type === 'phone'))) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Mobile/Phone Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMEI 1</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobile_imei_1"
                      value={formData.mobile_imei_1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.mobile_imei_1 || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IMEI 2</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobile_imei_2"
                      value={formData.mobile_imei_2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.mobile_imei_2 || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Memory</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobile_internal_memory"
                      value={formData.mobile_internal_memory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.mobile_internal_memory || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">External Memory</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobile_external_memory"
                      value={formData.mobile_external_memory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {asset.mobile_external_memory || 'N/A'}
                    </p>
                  )}
                </div>

                {((isEditing && formData.asset_type === 'phone') || (!isEditing && asset.asset_type === 'phone')) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {asset.phone_number || 'N/A'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Company</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_company"
                          value={formData.phone_company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {asset.phone_company || 'N/A'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Plan</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_current_plan"
                          value={formData.phone_current_plan}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {asset.phone_current_plan || 'N/A'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Legal Owner</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_legal_owner"
                          value={formData.phone_legal_owner}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {asset.phone_legal_owner || 'N/A'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Comment</label>
                      {isEditing ? (
                        <textarea
                          name="phone_comment"
                          value={formData.phone_comment}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200">
                          {asset.phone_comment || 'N/A'}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                {isEditing ? (
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200 whitespace-pre-wrap">
                    {asset.details || 'N/A'}
                  </p>
                )}
              </div>
            </div>

            {/* Asset Image Upload */}
            {isEditing && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetailModal;

