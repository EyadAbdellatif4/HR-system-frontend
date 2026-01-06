import api from '@/common/services/api';

// Helper function to format error messages
const formatErrorMessage = (error, defaultMessage) => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    return Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
};

export const userService = {
    getAllUsers: async (params = {}) => {
        try {
            const response = await api.get('/users', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting all users';
        }
    },

    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the user';
        }
    },

    createUser: async (userData, files = null) => {
        try {
            let response;
            if (files && files.length > 0) {
                // Use FormData if files are provided
                const formData = new FormData();
                
                // Append all user data fields
                Object.keys(userData).forEach((key) => {
                    const value = userData[key];
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            // Handle arrays (like personal_phone)
                            value.forEach((item) => {
                                formData.append(key, item);
                            });
                        } else if (typeof value === 'boolean') {
                            formData.append(key, String(value));
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });
                
                // Append files
                files.forEach((file) => {
                    formData.append('images', file);
                });
                
                response = await api.post('/users', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Regular JSON request if no files
                response = await api.post('/users', userData);
            }
            return response.data;
        } catch (error) {
            const formattedError = formatErrorMessage(error, 'An error occurred while creating the user');
            throw new Error(formattedError);
        }
    },
    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/me');
            // Backend returns: { message, user: {...} }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the current user';
        }
    },

    updateCurrentUser: async (userData, files = null) => {
        try {
            let response;
            if (files && files.length > 0) {
                // Use FormData if files are provided
                const formData = new FormData();
                
                // Append all user data fields
                Object.keys(userData).forEach((key) => {
                    const value = userData[key];
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            // Handle arrays (like personal_phone)
                            value.forEach((item) => {
                                formData.append(key, item);
                            });
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });
                
                // Append files
                files.forEach((file) => {
                    formData.append('images', file);
                });
                
                response = await api.patch('/users/me', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Regular JSON request if no files
                response = await api.patch('/users/me', userData);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while updating the profile';
        }
    },

    updateUser: async (id, userData, files = null) => {
        try {
            let response;
            if (files && files.length > 0) {
                // Use FormData if files are provided
                const formData = new FormData();
                
                // Append all user data fields
                Object.keys(userData).forEach((key) => {
                    const value = userData[key];
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            // Handle arrays (like personal_phone)
                            value.forEach((item) => {
                                formData.append(key, item);
                            });
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });
                
                // Append files
                files.forEach((file) => {
                    formData.append('images', file);
                });
                
                response = await api.patch(`/users/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Regular JSON request if no files
                response = await api.patch(`/users/${id}`, userData);
            }
            return response.data;
        } catch (error) {
            const formattedError = formatErrorMessage(error, 'An error occurred while updating the user');
            throw new Error(formattedError);
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while deleting the user';
        }
    },
}

export const roleService = {
    // Get all roles (admin only)
    getAllRoles: async () => {
        try {
            const response = await api.get('/roles');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting all roles';
        }
    },

    // Get role by ID (admin only)
    getRoleById: async (id) => {
        try {
            const response = await api.get(`/roles/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the role';
        }
    },

    // Create new role (admin only)
    createRole: async (roleData) => {
        try {
            const response = await api.post('/roles', roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while creating the role';
        }
    },

    // Update role (admin only) - uses PATCH not PUT
    updateRole: async (id, roleData) => {
        try {
            const response = await api.patch(`/roles/${id}`, roleData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while updating the role';
        }
    },

    // Delete role (admin only)
    deleteRole: async (id) => {
        try {
            const response = await api.delete(`/roles/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while deleting the role';
        }
    }
};

export const departmentService = {
    // Get all departments (admin only, but may be used during registration)
    getAllDepartments: async (params = {}) => {
        try {
            const response = await api.get('/departments', { params });
            // Handle different response structures
            const data = response.data;
            return data?.departments || data?.data?.items || data?.data || [];
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting departments';
        }
    },

    // Get department by ID
    getDepartmentById: async (id) => {
        try {
            const response = await api.get(`/departments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the department';
        }
    },
};

export const assetService = {
    getAllAssets: async (params = {}) => {
        try {
            const response = await api.get('/assets', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting all assets';
        }
    },
    getAssetById: async (id) => {
        try {
            const response = await api.get(`/assets/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the asset';
        }
    },
    createAsset: async (assetData, files = null) => {
        try {
            const formData = new FormData();
            Object.keys(assetData).forEach(key => {
                if (assetData[key] !== null && assetData[key] !== undefined) {
                    formData.append(key, assetData[key]);
                }
            });
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('images', file);
                });
            }
            const response = await api.post('/assets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while creating the asset';
            // Format array errors
            const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
            throw new Error(formattedError);
        }
    },
    updateAsset: async (id, assetData, files = null) => {
        try {
            const formData = new FormData();
            Object.keys(assetData).forEach(key => {
                if (assetData[key] !== null && assetData[key] !== undefined) {
                    formData.append(key, assetData[key]);
                }
            });
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('images', file);
                });
            }
            const response = await api.patch(`/assets/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            const formattedError = formatErrorMessage(error, 'An error occurred while updating the asset');
            throw new Error(formattedError);
        }
    },
    deleteAsset: async (id) => {
        try {
            const response = await api.delete(`/assets/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while deleting the asset';
        }
    },
};

export const assetTrackingService = {
    getAllAssetTrackings: async (params = {}) => {
        try {
            const response = await api.get('/asset-tracking', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting all asset trackings';
        }
    },
    getAssetTrackingsByUserId: async (userId, params = {}) => {
        try {
            const response = await api.get('/asset-tracking', { params: { ...params, user_id: userId } });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || `An error occurred while getting asset trackings for user ${userId}`;
        }
    },
    getAssetTrackingById: async (id) => {
        try {
            const response = await api.get(`/asset-tracking/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while getting the asset tracking';
        }
    },
    createAssetTracking: async (data) => {
        try {
            const response = await api.post('/asset-tracking', data);
            return response.data;
        } catch (error) {
            const formattedError = formatErrorMessage(error, 'An error occurred while creating asset tracking');
            throw new Error(formattedError);
        }
    },
    updateAssetTracking: async (id, data) => {
        try {
            const response = await api.patch(`/asset-tracking/${id}`, data);
            return response.data;
        } catch (error) {
            const formattedError = formatErrorMessage(error, 'An error occurred while updating asset tracking');
            throw new Error(formattedError);
        }
    },
    deleteAssetTracking: async (id) => {
        try {
            const response = await api.delete(`/asset-tracking/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'An error occurred while deleting asset tracking';
        }
    },
};

