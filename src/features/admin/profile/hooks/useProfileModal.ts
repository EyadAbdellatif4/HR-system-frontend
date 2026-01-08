import { useState, useEffect } from 'react';

export function useProfileModal({ profileData, isOpen, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    user_number: '',
    title: '',
    address: '',
    work_location: '',
    personal_phone: [],
    social_insurance: false,
    medical_insurance: false,
    join_date: '',
    contract_date: '',
    exit_date: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [modalError, setModalError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Update form data when profileData changes
  useEffect(() => {
    if (profileData) {
      // Initialize personal_phone as array
      const phoneArray = Array.isArray(profileData.personal_phone) 
        ? profileData.personal_phone 
        : (profileData.personal_phone ? [profileData.personal_phone] : []);
      
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        password: '',
        user_number: profileData.user_number || '',
        title: profileData.title || '',
        address: profileData.address || '',
        work_location: profileData.work_location || '',
        personal_phone: phoneArray,
        social_insurance: profileData.social_insurance || false,
        medical_insurance: profileData.medical_insurance || false,
        join_date: profileData.join_date || '',
        contract_date: profileData.contract_date || '',
        exit_date: profileData.exit_date || '',
      });
    }
    setValidationErrors({});
    setModalError('');
    setSelectedFiles([]);
    setImagePreview(null);
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

  const handleSubmit = async (e, additionalData = {}) => {
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
      // Handle personal_phone as array - filter out empty strings
      const phoneArray = Array.isArray(formData.personal_phone) 
        ? formData.personal_phone.filter(phone => phone && phone.trim())
        : [];
      
      const submitData = {
        name: formData.name.trim(),
        password: formData.password.trim() || undefined,
        user_number: formData.user_number.trim() || undefined,
        title: formData.title.trim() || undefined,
        address: formData.address.trim() || undefined,
        work_location: formData.work_location || undefined,
        personal_phone: phoneArray.length > 0 ? phoneArray : undefined,
        social_insurance: formData.social_insurance,
        medical_insurance: formData.medical_insurance,
        join_date: formData.join_date || undefined,
        contract_date: formData.contract_date || undefined,
        exit_date: formData.exit_date || undefined,
        ...additionalData, // Include department_ids from additionalData
      };

      // Remove undefined values
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      // Files will be passed separately to onSubmit
      // Store them in submitData for the handler
      submitData.files = selectedFiles.length > 0 ? selectedFiles : null;

      await onSubmit(submitData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save profile';
      setModalError(errorMessage);
      throw err; // Re-throw so modal knows it failed
    }
  };

  const handleCancel = () => {
    if (profileData) {
      // Reset personal_phone as array
      const phoneArray = Array.isArray(profileData.personal_phone) 
        ? profileData.personal_phone 
        : (profileData.personal_phone ? [profileData.personal_phone] : []);
      
      setFormData({
        name: profileData.name || '',
        username: profileData.username || '',
        password: '',
        user_number: profileData.user_number || '',
        title: profileData.title || '',
        address: profileData.address || '',
        work_location: profileData.work_location || '',
        personal_phone: phoneArray,
        social_insurance: profileData.social_insurance || false,
        medical_insurance: profileData.medical_insurance || false,
        join_date: profileData.join_date || '',
        contract_date: profileData.contract_date || '',
        exit_date: profileData.exit_date || '',
      });
    }
    setValidationErrors({});
    setModalError('');
    setSelectedFiles([]);
    setImagePreview(null);
  };

  const handleFileChange = (files) => {
    // FileUpload component passes File[] directly, not an event
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

