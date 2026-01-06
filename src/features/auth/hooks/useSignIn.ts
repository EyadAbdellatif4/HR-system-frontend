import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/authApi';
import { useAuth } from '@/common/providers/authContext';
import { validateSignIn } from '@/common/utils/validation';
import { useErrorMessage } from '@/common/hooks/useErrorMessage';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  updateFormField,
  setFormLoading,
  setValidationError,
  setTouchedField,
  resetForm,
} from '@/store/slices/formSlice';

export function useSignIn() {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.form.signIn);
  const formData = formState.formData;
  const loading = formState.loading;
  const validationErrors = formState.validationErrors;
  const touched = formState.touched;
  
  const [error, setErrorState] = useState('');
  const [success, setSuccessState] = useState('');
  const { error: errorMessage, success: successMessage, setError, setSuccess, clearError, clearSuccess } = useErrorMessage(3000);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation] = useLoginMutation();

  // Validate individual field
  const validateField = (name, value) => {
    const tempFormData = { ...formData, [name]: value };
    const errors = validateSignIn(tempFormData);
    const fieldError = errors[name] || '';
    dispatch(setValidationError({ form: 'signIn', field: name, error: fieldError }));
    return !fieldError;
  };

  // Validate entire form
  const validateForm = () => {
    const errors = validateSignIn(formData);
    
    Object.keys(errors).forEach((key) => {
      dispatch(setValidationError({ form: 'signIn', field: key, error: errors[key] || '' }));
    });

    dispatch(setTouchedField({ form: 'signIn', field: 'username', touched: true }));
    dispatch(setTouchedField({ form: 'signIn', field: 'password', touched: true }));

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ form: 'signIn', field: name, value }));
    
    // Clear general error when user starts typing
    if (errorMessage) clearError();
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    dispatch(setTouchedField({ form: 'signIn', field: name, touched: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    dispatch(setFormLoading({ form: 'signIn', loading: true }));
    clearError();
    clearSuccess();
    
    try {
      // Convert username to lowercase for case-insensitive login
      const usernameLower = formData.username ? formData.username.toLowerCase().trim() : formData.username;
      const response = await loginMutation({ username: usernameLower, password: formData.password }).unwrap();
      
      // Update auth context (response.user is set by RTK Query onQueryStarted)
      if (response.user) {
        login(response.user);
      }
      
      // Redirect to dashboard home
      setSuccess("Login successful! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate('/dashboard/home');
        dispatch(resetForm('signIn'));
      }, 1000);
    } catch (err: any) {
      // Extract error message and status properly - handle both string errors and Error objects
      const errorMsg = typeof err === 'string' 
        ? err 
        : err?.data?.message || err?.message || 'Invalid username or password';
      const errorStatus = err?.status || null;
      
      // Use centralized error handler (will handle auth errors and redirect if needed)
      setError(errorMsg, errorStatus);
      
      // Don't clear form data on error - keep user input
      console.error('Login error:', errorMsg);
    } finally {
      dispatch(setFormLoading({ form: 'signIn', loading: false }));
    }
  };

  return {
    formData,
    loading,
    error: errorMessage || error,
    success: successMessage || success,
    validationErrors,
    touched,
    handleInputChange,
    handleBlur,
    handleSubmit,
    clearError,
    clearSuccess,
  };
}

