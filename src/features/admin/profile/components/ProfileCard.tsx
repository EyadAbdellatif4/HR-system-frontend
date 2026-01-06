import React from 'react';
import {
  Typography,
  Button,
  Card,
  CardBody,
} from '@material-tailwind/react';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Helper function to get user initials
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function ProfileCard({
  userName,
  userEmail,
  userRole,
  userTitle,
  userNumber,
  userAddress,
  userWorkLocation,
  userPersonalPhone,
  isActive,
  createdDate,
  updatedDate,
  onEditClick,
}) {
  return (
    <Card className="shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center shadow-xl ring-4 ring-white/50 transition-transform duration-150 group-hover:scale-105">
              <span className="text-blue-600 text-3xl sm:text-4xl font-bold">
                {getInitials(userName)}
              </span>
            </div>
            {isActive && (
              <div className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <CheckCircleIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <Typography variant="h3" className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {userName}
            </Typography>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                {userRole.toUpperCase()}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Typography variant="small" className="text-gray-200 flex items-center justify-center sm:justify-start gap-1">
              <EnvelopeIcon className="w-4 h-4" />
              {userEmail}
            </Typography>
          </div>
        </div>
      </div>

      <CardBody className="p-6 sm:p-8">
        {/* Personal Information Section */}
        <div className="mb-8">
          <Typography variant="h6" className="text-gray-900 font-bold mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Personal Information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                  Full Name
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-900 font-medium">
                {userName}
              </Typography>
            </div>

            {/* Email Address */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                  Email Address
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-900 font-medium break-all">
                {userEmail}
              </Typography>
            </div>

            {/* Title */}
            {userTitle && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Title
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {userTitle}
                </Typography>
              </div>
            )}

            {/* User Number */}
            {userNumber && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    User Number
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {userNumber}
                </Typography>
              </div>
            )}

            {/* Work Location */}
            {userWorkLocation && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Work Location
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium capitalize">
                  {userWorkLocation}
                </Typography>
              </div>
            )}

            {/* Personal Phone */}
            {userPersonalPhone && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Personal Phone
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {Array.isArray(userPersonalPhone) ? userPersonalPhone.join(', ') : userPersonalPhone}
                </Typography>
              </div>
            )}

            {/* Address */}
            {userAddress && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Address
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {userAddress}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Account Information Section */}
        <div className="mb-8">
          <Typography variant="h6" className="text-gray-900 font-bold mb-6 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            Account Information
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                  Account Status
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <Typography
                  variant="paragraph"
                  className={isActive ? 'text-green-600 font-semibold' : 'text-gray-600 font-medium'}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </Typography>
              </div>
            </div>

            {/* User Role */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                  Role
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-900 font-medium">
                {userRole}
              </Typography>
            </div>

            {/* Created Date */}
            {createdDate !== 'N/A' && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Member Since
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {createdDate}
                </Typography>
              </div>
            )}

            {/* Last Updated */}
            {updatedDate !== 'N/A' && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600 font-semibold uppercase tracking-wide text-xs">
                    Last Updated
                  </Typography>
                </div>
                <Typography variant="paragraph" className="text-gray-900 font-medium">
                  {updatedDate}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="filled"
            color="blue"
            onClick={onEditClick}
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <PencilIcon className="w-5 h-5" />
            Edit Profile
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

