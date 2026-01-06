import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
  Input,
  Alert,
} from '@material-tailwind/react';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useProfileModal } from '@/modules/admin/hooks';
import { FileUpload } from '@/shared/components';

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

  return (
    <Dialog 
      open={isOpen} 
      handler={onClose} 
      size="lg" 
      className="w-full max-w-full sm:max-w-2xl"
    >
      <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <PencilIcon className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h5" className="text-white text-lg sm:text-xl font-bold">
              Edit Personal Information
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </DialogHeader>
      <DialogBody className="p-6 sm:p-8">
        {modalError && (
          <Alert color="red" className="mb-6 animate-in fade-in duration-150">
            {modalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Full Name
                <span className="text-red-500 ml-1">*</span>
              </Typography>
            </label>
            <Input
              label="Enter your full name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                // Clear error when user starts typing
                if (validationErrors.name) {
                  setValidationErrors({ ...validationErrors, name: null });
                }
              }}
              error={!!validationErrors.name}
              required
              className=""
              containerProps={{
                className: 'min-w-0',
              }}
            />
            {validationErrors.name && (
              <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                {validationErrors.name}
              </Typography>
            )}
          </div>

          {/* Username (Email) - Read Only */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <EnvelopeIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Email Address
              </Typography>
            </label>
            <Input
              label="Email address"
              type="email"
              value={formData.username}
              disabled
              className="cursor-not-allowed bg-gray-50"
              containerProps={{
                className: 'min-w-0',
              }}
            />
            <Typography variant="small" className="mt-2 text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Email address cannot be changed for security reasons
            </Typography>
          </div>

          {/* Title - Optional */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Title
              </Typography>
            </label>
            <Input
              label="e.g., Software Engineer"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
              }}
              className=""
              containerProps={{
                className: 'min-w-0',
              }}
            />
          </div>

          {/* Address - Optional */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Address
              </Typography>
            </label>
            <Input
              label="Enter your address"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
              }}
              className=""
              containerProps={{
                className: 'min-w-0',
              }}
            />
          </div>

          {/* Work Location - Optional */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Work Location
              </Typography>
            </label>
            <select
              value={formData.work_location}
              onChange={(e) => {
                setFormData({ ...formData, work_location: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select Location</option>
              <option value="remote">Remote</option>
              <option value="office">Office</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Personal Phone - Optional */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Personal Phone
              </Typography>
            </label>
            <Input
              label="Enter phone number(s), comma-separated for multiple"
              value={formData.personal_phone}
              onChange={(e) => {
                setFormData({ ...formData, personal_phone: e.target.value });
              }}
              className=""
              containerProps={{
                className: 'min-w-0',
              }}
            />
            <Typography variant="small" className="mt-2 text-gray-500">
              Separate multiple numbers with commas
            </Typography>
          </div>

          {/* Password - Optional */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <LockClosedIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                New Password
              </Typography>
            </label>
            <Input
              label="Leave empty to keep current password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                // Clear error when user starts typing
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: null });
                }
              }}
              error={!!validationErrors.password}
              className=""
              containerProps={{
                className: 'min-w-0',
              }}
            />
            {validationErrors.password && (
              <Typography variant="small" color="red" className="mt-2 flex items-center gap-1">
                {validationErrors.password}
              </Typography>
            )}
            <Typography variant="small" className="mt-2 text-gray-500">
              Password must be at least 6 characters long
            </Typography>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-gray-600" />
              <Typography variant="small" className="text-gray-700 font-semibold">
                Profile Image
              </Typography>
            </label>
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
        </form>
      </DialogBody>
      <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button
          type="button"
          variant="outlined"
          color="blue"
          onClick={() => {
            handleCancel();
            onClose();
          }}
          disabled={loading}
          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="filled"
          color="blue"
          onClick={handleSubmit}
          disabled={loading || !formData.name.trim()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </span>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
