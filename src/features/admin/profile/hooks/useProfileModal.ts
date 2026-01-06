import { useState, useEffect } from 'react';

export function useProfileModal({ profileData, isOpen, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    title: '',
    address: '',
    work_location: '',
    personal_phone: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [modalError, setModalError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Update form data when profileData changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        password: '',
        title: profileData.title || '',
        address: profileData.address || '',
        work_location: profileData.work_location || '',
        personal_phone: Array.isArray(profileData.personal_phone) 
          ? profileData.personal_phone.join(', ') 
          : (profileData.personal_phone || ''),
      });
    }
    setValidationErrors({});
    setModalError('');
  }, [profileData, isOpen]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    
    if (formData.password && formData.password.trim() !== '') {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setModalError('');
    setValidationErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        password: formData.password.trim() || undefined,
        title: formData.title.trim() || undefined,
        address: formData.address.trim() || undefined,
        work_location: formData.work_location || undefined,
        personal_phone: formData.personal_phone.trim() 
          ? (formData.personal_phone.includes(',') 
              ? formData.personal_phone.split(',').map(p => p.trim()).filter(p => p)
              : [formData.personal_phone.trim()])
          : undefined,
      };

      // Remove undefined values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      // Add files to submitData
      submitData.files = selectedFiles.length > 0 ? selectedFiles : null;

      await onSubmit(submitData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save profile';
      setModalError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        password: '',
        title: profileData.title || '',
        address: profileData.address || '',
        work_location: profileData.work_location || '',
        personal_phone: Array.isArray(profileData.personal_phone) 
          ? profileData.personal_phone.join(', ') 
          : (profileData.personal_phone || ''),
      });
    }
    setValidationErrors({});
    setModalError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
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

  return {
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
  };
}

