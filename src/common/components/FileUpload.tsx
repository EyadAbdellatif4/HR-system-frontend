import React, { useRef, useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

/**
 * FileUpload Component
 * A drag-and-drop file upload component with preview
 * 
 * @param {Object} props
 * @param {Function} props.onFileChange - Callback when files are selected (receives File[])
 * @param {string} props.accept - File types to accept (default: "image/*")
 * @param {boolean} props.multiple - Allow multiple files (default: false)
 * @param {string} props.label - Label text (default: "Click to upload or drag and drop")
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.previewUrl - URL for existing image preview
 * @param {Function} props.onRemove - Callback when remove button is clicked
 */
export function FileUpload({
  onFileChange,
  accept = "image/*",
  multiple = false,
  label = "Click to upload or drag and drop",
  helperText = "SVG, PNG, JPG or GIF (MAX. 800×400px)",
  previewUrl = null,
  onRemove = null,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    if (fileArray.length > 0) {
      // Create preview for first image
      if (accept.includes('image')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(fileArray[0]);
      }
      onFileChange(fileArray);
    }
  }, [accept, onFileChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);

  const displayPreview = preview || previewUrl;

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'
          }
        `}
        style={{
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'rgba(249, 250, 251, 0.5)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {displayPreview ? (
          <div className="relative inline-block">
            <img
              src={displayPreview}
              alt="Preview"
              className="max-w-full max-h-48 rounded-lg object-cover border-2 border-gray-300 shadow-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              {helperText && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </p>
              {helperText && (
                <p className="text-xs text-gray-500">{helperText}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FileUpload;

