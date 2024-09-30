import api from './apiServices';

// Create a new user
export const createUser = async (userData) => {
    try {
        const response = await api.post('register', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Fetch a single user by ID
export const fetchUserById = async (userId) => {
    try {
        const response = await api.get(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Update a user by ID
export const updateUserById = async (userId, userData) => {
    try {
        // Only include password in the request if it is provided
        const { password, ...updateData } = userData;
        const response = await api.put(`users/${userId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user by ID
export const deleteUserById = async (userId) => {
    try {
        const response = await api.delete(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Fetch all users (you may already have this in apiService.jsx)
export const fetchAllUsers = async () => {
    try {
        const response = await api.get('users');
        return response.data;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};
