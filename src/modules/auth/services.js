import api from '@/shared/services/api';

export const authService = {
    login: async (username, password) => {
        try {
            // Convert username to lowercase for case-insensitive login
            const usernameLower = username ? username.toLowerCase().trim() : username;
            const response = await api.post('/auth/login', { username: usernameLower, password });
            const data = response.data;
            
            // Backend returns access_token, refresh_token, and user
            const accessToken = data.access_token;
            const user = data.user;
            
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } else {
                console.error('No access_token received in login response:', data);
            }
            
            // Return the expected format
            return { token: accessToken, user: user || data };
            
        } catch (error) {
            // Extract error message from various possible structures
            const errorMessage = 
                error.response?.data?.message || 
                error.response?.data?.error ||
                error.message || 
                'Invalid username or password. Please try again.';
            
            console.error('Auth service error:', error);
            throw new Error(errorMessage);
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            const errorMessage = 
                error.response?.data?.message || 
                error.response?.data?.error ||
                error.message || 
                'Registration failed';
            throw new Error(errorMessage);
        }
    },
    
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/sign-in';
    },


    isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
    },

    getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
    }, 
}

