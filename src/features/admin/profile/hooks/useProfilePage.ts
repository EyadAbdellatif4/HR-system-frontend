import { useState, useEffect, useMemo } from 'react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { userService } from '@/features/admin/users/services';

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
        updateData.personal_phone = submitData.personal_phone || null;
      }

      // Use updateCurrentUser to update the current user's profile (works for both admin and user flows)
      await userService.updateCurrentUser(updateData, submitData.files || null);
      setSuccess('Profile updated successfully!');
      setIsModalOpen(false);
      await refetch();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
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

