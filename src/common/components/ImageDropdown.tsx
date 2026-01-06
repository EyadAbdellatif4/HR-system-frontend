import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Package } from 'lucide-react';
import { getApiUrl } from '@/config/env';

/**
 * ImageDropdown Component
 * A custom dropdown that displays items with images (for users or assets)
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of items to display
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Callback when item is selected
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.loading - Loading state
 * @param {string} props.type - 'user' or 'asset'
 * @param {Function} props.getImageUrl - Function to get image URL from item
 * @param {Function} props.getDisplayText - Function to get display text from item
 * @param {Function} props.getSubText - Function to get sub text from item
 */
export function ImageDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  loading = false,
  type = 'user',
  getImageUrl,
  getDisplayText,
  getSubText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectedItem = options.find(item => item.id === value || item.id?.toString() === value?.toString());

  const handleSelect = (item) => {
    onChange(item.id);
    setIsOpen(false);
  };

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getDefaultImageUrl = (item) => {
    if (type === 'user') {
      const userName = getDisplayText?.(item) || item.name || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&size=128`;
    } else {
      const assetName = getDisplayText?.(item) || item.label || item.model || 'Asset';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(assetName)}&background=10b981&color=fff&size=128`;
    }
  };

  const getItemImageUrl = (item) => {
    if (imageErrors[item.id]) {
      return getDefaultImageUrl(item);
    }
    const customUrl = getImageUrl?.(item);
    if (customUrl) return customUrl;
    
    // Try to get from attachments
    const attachmentUrl = item?.attachments?.[0]?.path_URL;
    if (attachmentUrl) {
      return `${getApiUrl()}/files/${attachmentUrl}`;
    }
    
    return getDefaultImageUrl(item);
  };

  const IconComponent = type === 'user' ? User : Package;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Item Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : selectedItem ? (
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={getItemImageUrl(selectedItem)}
              alt={getDisplayText?.(selectedItem) || selectedItem.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={() => handleImageError(selectedItem.id)}
            />
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getDisplayText?.(selectedItem) || selectedItem.name}
              </div>
              {getSubText && (
                <div className="text-xs text-gray-500 truncate">
                  {getSubText(selectedItem)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {options.map((item) => {
                const isSelected = (item.id === value || item.id?.toString() === value?.toString());
                const itemImageUrl = getItemImageUrl(item);
                const displayText = getDisplayText?.(item) || item.name;
                const subText = getSubText?.(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <img
                      src={itemImageUrl}
                      alt={displayText}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      onError={() => handleImageError(item.id)}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className={`text-sm font-medium truncate ${
                        isSelected ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {displayText}
                      </div>
                      {subText && (
                        <div className="text-xs text-gray-500 truncate">
                          {subText}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

