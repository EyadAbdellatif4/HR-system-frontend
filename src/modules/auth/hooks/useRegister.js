import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/modules/auth/services';
import { validateRegister } from '@/shared/utils/validation';
import { useErrorMessage } from '@/shared/hooks/useErrorMessage';
import api from '@/shared/services/api';

export function useRegister() {
  const [formData, setFormData] = useState({
    user_number: '',
    name: '',
    username: '',
    address: '',
    work_location: '',
    join_date: '',
    social_insurance: false,
    medical_insurance: false,
    title: '',
    departments: [],
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const { error, success, setError, setSuccess, clearError, clearSuccess } = useErrorMessage(5000);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Try to fetch departments - this might fail if endpoint requires auth
        const response = await api.get('/departments', { 
          params: { limit: 100, is_active: true } 
        });
        // Handle different response structures
        const deptData = response.data?.departments || response.data?.data?.items || response.data?.data || [];
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (err) {
        // If departments can't be fetched (e.g., requires auth), log but don't block registration
        console.warn('Could not fetch departments:', err);
        // Set empty array so form can still be used
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Validate individual field
  const validateField = (name, value) => {
    const tempFormData = { ...formData, [name]: value };
    const errors = validateRegister(tempFormData);
    const fieldError = errors[name] || '';
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
    return !fieldError;
  };

  // Validate entire form
  const validateForm = () => {
    const errors = validateRegister(formData);
    setValidationErrors(errors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear general error when user starts typing
    if (error) clearError();
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (error) clearError();
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleDateChange = (dateString) => {
    setFormData(prev => ({ ...prev, join_date: dateString }));
    
    if (error) clearError();
    
    if (touched.join_date) {
      validateField('join_date', dateString);
    }
  };

  const handleDepartmentsChange = (selectedIds) => {
    setFormData(prev => ({ ...prev, departments: selectedIds }));
    
    if (error) clearError();
    
    if (touched.departments) {
      validateField('departments', selectedIds);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError();
    clearSuccess();
    
    try {
      // Prepare data for backend (ensure departments is an array)
      const registrationData = {
        ...formData,
        departments: Array.isArray(formData.departments) ? formData.departments : [],
      };

      await authService.register(registrationData);
      
      setSuccess('Registration successful! Redirecting to sign in...');
      
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 2000);
    } catch (err) {
      const errorMessage = typeof err === 'string' 
        ? err 
        : err?.response?.data?.message || err?.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
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
    clearError,
    clearSuccess,
  };
}

