import React, { useState } from 'react';
import {
  Input,
  Button,
  Typography,
  Alert,
  Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";
import { Menu } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRegister } from '../hooks/useRegister';
import { DatePicker } from '@/common/components';

export function RegisterPage() {
  const {
    formData,
    loading,
    departments,
    departmentsLoading,
    error,
    success,
    validationErrors,
    touched,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleDepartmentsChange,
    handleBlur,
    handleSubmit,
  } = useRegister();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const workLocationOptions = [
    { value: 'in-office', label: 'In Office' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'remote', label: 'Remote' },
  ];

  return (
    <section className="m-8 flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/Emails Vertical.svg"
              alt="HR System"
              className="h-48 w-auto"
            />
          </div>
          <Typography variant="h2" className="font-bold mb-2">Register</Typography>
          <Typography variant="paragraph" className="text-base font-normal text-text-secondary">
            Create your account to get started.
          </Typography>
        </div>

        {error && (
          <Alert color="red" className="mt-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" className="mt-4">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* User Number */}
            <div className="flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                User Number *
              </Typography>
              <Input
                size="lg"
                placeholder="EMP001"
                className={
                  validationErrors.user_number && touched.user_number
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="user_number"
                value={formData.user_number}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.user_number && touched.user_number}
              />
              {validationErrors.user_number && touched.user_number && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.user_number}
                </Typography>
              )}
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Full Name *
              </Typography>
              <Input
                size="lg"
                placeholder="John Doe"
                className={
                  validationErrors.name && touched.name
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.name && touched.name}
              />
              {validationErrors.name && touched.name && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.name}
                </Typography>
              )}
            </div>

            {/* Username (Email) */}
            <div className="flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Email *
              </Typography>
              <Input
                size="lg"
                type="email"
                placeholder="name@mail.com"
                className={
                  validationErrors.username && touched.username
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.username && touched.username}
              />
              {validationErrors.username && touched.username && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.username}
                </Typography>
              )}
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Title *
              </Typography>
              <Input
                size="lg"
                placeholder="Software Engineer"
                className={
                  validationErrors.title && touched.title
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.title && touched.title}
              />
              {validationErrors.title && touched.title && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.title}
                </Typography>
              )}
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2 flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Address *
              </Typography>
              <Input
                size="lg"
                placeholder="123 Main St, City, Country"
                className={
                  validationErrors.address && touched.address
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.address && touched.address}
              />
              {validationErrors.address && touched.address && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.address}
                </Typography>
              )}
            </div>

            {/* Work Location */}
            <div className="flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Work Location *
              </Typography>
              <Select
                size="lg"
                value={formData.work_location}
                onChange={(val) => handleSelectChange('work_location', val)}
                className={
                  validationErrors.work_location && touched.work_location
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                error={validationErrors.work_location && touched.work_location}
              >
                {workLocationOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              {validationErrors.work_location && touched.work_location && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.work_location}
                </Typography>
              )}
            </div>

            {/* Join Date */}
            <div className="relative flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Join Date *
              </Typography>
              <Input
                size="lg"
                type="text"
                placeholder="YYYY-MM-DD"
                value={formData.join_date}
                onChange={(e) => handleDateChange(e.target.value)}
                onFocus={() => setShowDatePicker(true)}
                className={
                  validationErrors.join_date && touched.join_date
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                error={validationErrors.join_date && touched.join_date}
              />
              {showDatePicker && (
                <DatePicker
                  value={formData.join_date}
                  onChange={(date) => {
                    handleDateChange(date);
                    setShowDatePicker(false);
                  }}
                  show={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                />
              )}
              {validationErrors.join_date && touched.join_date && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.join_date}
                </Typography>
              )}
            </div>

            {/* Insurance Checkboxes - Side by Side */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Checkbox
                    name="social_insurance"
                    checked={formData.social_insurance}
                    onChange={handleInputChange}
                    label="Social Insurance *"
                    className={
                      validationErrors.social_insurance && touched.social_insurance
                        ? 'border-error'
                        : ''
                    }
                  />
                  {validationErrors.social_insurance && touched.social_insurance && (
                    <Typography variant="small" className="mt-1 flex items-center gap-1 font-normal text-error">
                      {validationErrors.social_insurance}
                    </Typography>
                  )}
                </div>
                <div>
                  <Checkbox
                    name="medical_insurance"
                    checked={formData.medical_insurance}
                    onChange={handleInputChange}
                    label="Medical Insurance *"
                    className={
                      validationErrors.medical_insurance && touched.medical_insurance
                        ? 'border-error'
                        : ''
                    }
                  />
                  {validationErrors.medical_insurance && touched.medical_insurance && (
                    <Typography variant="small" className="mt-1 flex items-center gap-1 font-normal text-error">
                      {validationErrors.medical_insurance}
                    </Typography>
                  )}
                </div>
              </div>
            </div>

            {/* Departments - Full Width */}
            <div className="md:col-span-2 flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Departments *
              </Typography>
              {departmentsLoading ? (
                <Typography variant="small" className="text-text-secondary">
                  Loading departments...
                </Typography>
              ) : departments.length === 0 ? (
                <Typography variant="small" className="text-error">
                  No departments available. Please contact an administrator.
                </Typography>
              ) : (
                <Menu as="div" className="relative inline-block w-full">
                  <Menu.Button
                    className={`w-full inline-flex justify-between items-center gap-x-1.5 rounded-lg bg-white px-3 py-2.5 text-sm text-gray-900 border-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      validationErrors.departments && touched.departments 
                        ? '!border-red-500' 
                        : 'border-gray-300'
                    }`}
                  >
                    <span className="truncate">
                      {formData.departments.length === 0
                        ? 'Select departments'
                        : `${formData.departments.length} department(s) selected`}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-500" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 z-[9999] mt-2 w-full origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto border border-gray-200">
                    <div className="py-1">
                      {departments.map((dept) => {
                        const isSelected = formData.departments.includes(dept.id);
                        return (
                          <Menu.Item key={dept.id}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  const newSelection = isSelected
                                    ? formData.departments.filter(id => id !== dept.id)
                                    : [...formData.departments, dept.id];
                                  handleDepartmentsChange(newSelection);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                                  active ? 'bg-gray-100' : 'bg-white'
                                } ${isSelected ? 'font-medium' : ''}`}
                              >
                                <div className={`flex-shrink-0 w-4 h-4 border-2 rounded flex items-center justify-center ${
                                  isSelected 
                                    ? 'bg-blue-500 border-blue-500' 
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <CheckIcon className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className={isSelected ? 'text-blue-600' : 'text-gray-900'}>
                                  {dept.name}
                                </span>
                              </button>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </div>
                  </Menu.Items>
                </Menu>
              )}
              {validationErrors.departments && touched.departments && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.departments}
                </Typography>
              )}
            </div>

            {/* Password - Full Width */}
            <div className="md:col-span-2 flex flex-col">
              <Typography variant="small" className="mb-2 font-medium text-text-secondary">
                Password *
              </Typography>
              <Input
                size="lg"
                type="password"
                placeholder="********"
                className={
                  validationErrors.password && touched.password
                    ? '!border-error !border-t-error focus:!border-error'
                    : '!border-gray-200 focus:!border-primary'
                }
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={validationErrors.password && touched.password}
              />
              {validationErrors.password && touched.password && (
                <Typography variant="small" className="mt-1.5 flex items-center gap-1 font-normal text-error">
                  {validationErrors.password}
                </Typography>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading || departmentsLoading} className="mt-8" color="blue" fullWidth size="lg">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Typography variant="small" className="font-normal text-text-secondary">
            Already have an account?{' '}
            <a href="/auth/sign-in" className="font-medium text-primary hover:underline">
              Sign in here
            </a>
          </Typography>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;

