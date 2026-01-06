/**
 * Validation utility functions
 */

/**
 * Validate project data
 * @param {Object} project - The project object to validate
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateProject = (project) => {
  const errors = {};
  
  if (!project.name || project.name.trim() === '') {
    errors.name = 'Project name is required';
  } else if (project.name.length < 2) {
    errors.name = 'Project name must be at least 2 characters';
  }
  
  if (project.logo_url && project.logo_url.trim() !== '') {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(project.logo_url)) {
      errors.logo_url = 'Please enter a valid URL';
    }
  }
  
  return errors;
};

/**
 * Validate user data
 * @param {Object} user - The user object to validate
 * @param {Boolean} isEditing - Whether the user is being edited (password not required)
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateUser = (user, isEditing = false) => {
  const errors = {};
  
  if (!user.name || user.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (user.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  
  if (!user.email || user.email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }
  
  // Password is required when creating, optional when editing
  if (!isEditing) {
    if (!user.password || user.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (user.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  } else if (user.password && user.password.trim() !== '') {
    // If password is provided during edit, it must be valid
    if (user.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  }
  
  if (!user.role_id) {
    errors.role_id = 'Role is required';
  }
  
  return errors;
};

/**
 * Validate sign-in form data
 * @param {Object} formData - The sign-in form data (username, password)
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateSignIn = (formData) => {
  const errors = {};
  
  // Username validation (username is an email)
  if (!formData.username || formData.username.trim() === '') {
    errors.username = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
    }
  }
  
  // Password validation
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return errors;
};

/**
 * Validate registration form data
 * @param {Object} formData - The registration form data
 * @returns {Object} - Object containing validation errors (empty if valid)
 */
export const validateRegister = (formData) => {
  const errors = {};
  
  // User number validation
  if (!formData.user_number || formData.user_number.trim() === '') {
    errors.user_number = 'User number is required';
  }
  
  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  
  // Username (email) validation
  if (!formData.username || formData.username.trim() === '') {
    errors.username = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      errors.username = 'Please enter a valid email address';
    }
  }
  
  // Address validation
  if (!formData.address || formData.address.trim() === '') {
    errors.address = 'Address is required';
  }
  
  // Work location validation
  const validWorkLocations = ['in-office', 'hybrid', 'remote'];
  if (!formData.work_location || formData.work_location.trim() === '') {
    errors.work_location = 'Work location is required';
  } else if (!validWorkLocations.includes(formData.work_location)) {
    errors.work_location = 'Please select a valid work location';
  }
  
  // Join date validation
  if (!formData.join_date || formData.join_date.trim() === '') {
    errors.join_date = 'Join date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.join_date)) {
      errors.join_date = 'Please enter a valid date (YYYY-MM-DD)';
    } else {
      const joinDate = new Date(formData.join_date);
      if (isNaN(joinDate.getTime())) {
        errors.join_date = 'Please enter a valid date';
      }
    }
  }
  
  // Social insurance validation (boolean)
  if (formData.social_insurance === undefined || formData.social_insurance === null) {
    errors.social_insurance = 'Social insurance selection is required';
  }
  
  // Medical insurance validation (boolean)
  if (formData.medical_insurance === undefined || formData.medical_insurance === null) {
    errors.medical_insurance = 'Medical insurance selection is required';
  }
  
  // Title validation
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  // Departments validation
  if (!formData.departments || !Array.isArray(formData.departments) || formData.departments.length === 0) {
    errors.departments = 'At least one department is required';
  }
  
  // Password validation
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (formData.password.length > 255) {
    errors.password = 'Password must be less than 255 characters';
  }
  
  return errors;
};

