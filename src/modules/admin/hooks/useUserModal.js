import { useState, useEffect } from 'react';
import { validateUser } from '@/shared/utils/validation';
import { roleService } from '@/modules/admin/services';

export function useUserModal({ user, isOpen, isCreating, isEditing, onSubmit, onEditCancel, onRefresh }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role_id: user?.role_id || '',
    is_active: user?.is_active ?? true,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [modalError, setModalError] = useState('');
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

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
    } else if (isCreating) {
      setFormData({ name: '', email: '', password: '', role_id: '', is_active: true });
    }
    setValidationErrors({});
    setModalError('');
  }, [user, isCreating]);

  const handleSubmit = async () => {
    setModalError('');
    const errors = validateUser(formData, isEditing);
    
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

    if (formData.password && formData.password.trim() !== '') {
      submitData.password = formData.password;
    }

    if (isCreating && formData.role_id) {
      const selectedRole = roles.find(r => r.id === formData.role_id);
      submitData.type = selectedRole?.name === 'admin' ? 'admin' : 'user';
    }

    try {
      await onSubmit(submitData);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setModalError(err.message || 'Failed to save user');
    }
  };

  const handleCancelEdit = () => {
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
    setModalError('');
    if (onEditCancel) {
      onEditCancel();
    }
  };

  return {
    formData,
    setFormData,
    validationErrors,
    modalError,
    roles,
    loadingRoles,
    handleSubmit,
    handleCancelEdit,
  };
}

