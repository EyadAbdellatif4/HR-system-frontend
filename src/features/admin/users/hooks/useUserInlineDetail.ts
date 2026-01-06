import { useState, useEffect } from 'react';
import { validateUser } from '@/common/utils/validation';
import { roleService } from '../services';

export function useUserInlineDetail({ user, onSubmit, onDelete, onCollapse, onRefresh, loading }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role_id: user?.role_id || '',
    is_active: user?.is_active ?? true,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.roles || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role_id: user.role_id,
        is_active: user.is_active,
      });
    }
    setValidationErrors({});
    setError('');
  }, [user]);

  const handleSubmit = async () => {
    setError('');
    const errors = validateUser(formData, true);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role_id: formData.role_id,
      is_active: formData.is_active,
    };

    // Only include password if provided
    if (formData.password && formData.password.trim() !== '') {
      submitData.password = formData.password;
    }

    try {
      await onSubmit(submitData);
      if (onRefresh) {
        await onRefresh();
      }
      if (onCollapse) {
        onCollapse();
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return {
    formData,
    setFormData,
    validationErrors,
    error,
    roles,
    loadingRoles,
    showDeleteDialog,
    setShowDeleteDialog,
    handleSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
    getInitials,
  };
}

