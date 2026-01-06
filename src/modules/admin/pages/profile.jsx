import React from 'react';
import { Spinner, Alert } from '@material-tailwind/react';
import { useProfilePage } from '@/modules/admin/hooks';
import { ProfileModal } from '@/modules/admin/components/ProfileModal';
import { ProfileCard } from '@/modules/admin/components/ProfileCard';
import { ProfileQuickActions } from '@/modules/admin/components/ProfileQuickActions';
import { LoadingSpinner, ErrorState } from '@/shared/components';

export function Profile() {
  const {
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
  } = useProfilePage();

  // Loading state
  if (loading) {
    return <LoadingSpinner className="mt-12" />;
  }

  // Error state
  if (fetchError || !user) {
    return (
      <div className="mt-12">
        <ErrorState error={fetchError || 'Failed to load profile data'} />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8">
      {/* Success/Error Messages */}
      {error && (
        <Alert color="red" className="mb-6 animate-in fade-in duration-150">
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="green" className="mb-6 animate-in fade-in duration-150">
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <ProfileCard
            userName={profileDisplayData?.userName}
            userEmail={profileDisplayData?.userEmail}
            userRole={profileDisplayData?.userRole}
            userTitle={profileDisplayData?.userTitle}
            userNumber={profileDisplayData?.userNumber}
            userAddress={profileDisplayData?.userAddress}
            userWorkLocation={profileDisplayData?.userWorkLocation}
            userPersonalPhone={profileDisplayData?.userPersonalPhone}
            isActive={profileDisplayData?.isActive}
            createdDate={profileDisplayData?.createdDate}
            updatedDate={profileDisplayData?.updatedDate}
            onEditClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-1">
          <ProfileQuickActions onEditClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileData={profileData}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}

export default Profile;

