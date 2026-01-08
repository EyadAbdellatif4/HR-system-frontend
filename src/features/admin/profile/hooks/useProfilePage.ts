import { useState, useEffect, useMemo } from 'react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useUpdateCurrentUserMutation } from '@/store/hooks';

/**
 * Format a date string to a readable format
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function useProfilePage() {
  const { user, loading, error: fetchError, refetch } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updateCurrentUser] = useUpdateCurrentUserMutation();

  const handleSubmit = async (submitData) => {
    if (!user?.id) {
      setError('User ID not available');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = { name: submitData.name.trim() };
      if (submitData.password && submitData.password.trim() !== '') {
        updateData.password = submitData.password;
      }
      if (submitData.title !== undefined) {
        updateData.title = submitData.title || null;
      }
      if (submitData.address !== undefined) {
        updateData.address = submitData.address || null;
      }
      if (submitData.work_location !== undefined) {
        updateData.work_location = submitData.work_location || null;
      }
      if (submitData.personal_phone !== undefined) {
        // Handle personal_phone as array
        const phoneArray = Array.isArray(submitData.personal_phone)
          ? submitData.personal_phone.filter(phone => phone && phone.trim())
          : (submitData.personal_phone ? [submitData.personal_phone] : []);
        updateData.personal_phone = phoneArray.length > 0 ? phoneArray : null;
      }
      if (submitData.user_number !== undefined) {
        updateData.user_number = submitData.user_number || null;
      }
      if (submitData.social_insurance !== undefined) {
        updateData.social_insurance = submitData.social_insurance;
      }
      if (submitData.medical_insurance !== undefined) {
        updateData.medical_insurance = submitData.medical_insurance;
      }
      if (submitData.join_date !== undefined) {
        updateData.join_date = submitData.join_date || null;
      }
      if (submitData.contract_date !== undefined) {
        updateData.contract_date = submitData.contract_date || null;
      }
      if (submitData.exit_date !== undefined) {
        updateData.exit_date = submitData.exit_date || null;
      }
      if (submitData.department_ids !== undefined) {
        updateData.department_ids = submitData.department_ids.length > 0 ? submitData.department_ids : undefined;
      }

      // Use RTK Query mutation for file upload support
      const files = submitData.files && Array.isArray(submitData.files) && submitData.files.length > 0
        ? submitData.files
        : undefined;
      
      await updateCurrentUser({ data: updateData, files }).unwrap();
      setSuccess('Profile updated successfully!');
      setIsModalOpen(false);
      await refetch();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err?.data?.message || err?.message || 'Failed to update profile';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Computed values for profile display
  const profileData = useMemo(() => {
    if (!user) return null;
    return {
      name: user.name || '',
      username: user.username || '',
      title: user.title || '',
      address: user.address || '',
      work_location: user.work_location || '',
      personal_phone: user.personal_phone || '',
      attachments: user.attachments || [],
      user_number: user.user_number || '',
      social_insurance: user.social_insurance || false,
      medical_insurance: user.medical_insurance || false,
      join_date: user.join_date || '',
      contract_date: user.contract_date || '',
      exit_date: user.exit_date || '',
      departments: user.departments || [],
    };
  }, [user]);

  const profileDisplayData = useMemo(() => {
    if (!user) return null;
    
    return {
      userName: user.name || user.username?.split('@')[0] || 'User',
      userEmail: user.username || '',
      userRole: user?.role?.name || user?.role_name || 'User',
      userTitle: user.title || null,
      userNumber: user.user_number || null,
      userAddress: user.address || null,
      userWorkLocation: user.work_location || null,
      userPersonalPhone: user.personal_phone || null,
      isActive: user?.is_active !== false,
      createdDate: formatDate(user?.createdAt || user?.created_at),
      updatedDate: formatDate(user?.updatedAt || user?.updated_at),
      joinDate: formatDate(user?.join_date),
      contractDate: formatDate(user?.contract_date),
      exitDate: formatDate(user?.exit_date),
      socialInsurance: user.social_insurance || false,
      medicalInsurance: user.medical_insurance || false,
      departments: user.departments || [],
    };
  }, [user, profileData]);

  return {
    user,
    loading,
    fetchError,
    isModalOpen,
    setIsModalOpen,
    saving,
    error,
    success,
    profileData,
    profileDisplayData,
    handleSubmit,
  };
}

