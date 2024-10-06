import api from './apiServices.jsx';

const ClassesServices = {
    fetchClasses: async () => {
        try {
            const response = await api.get('/classes');
            return response.data;
        } catch (error) {
            console.error('Error fetching all classes:', error);
            throw error;
        }
    },

    getClassById: async (id) => {
        try {
            const response = await api.get(`/classes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching class with ID ${id}:`, error);
            throw error;
        }
    },

    createClass: async (classData) => {
        try {
            const response = await api.post('/classes', classData);
            return response.data;
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    },

    updateClass: async (id, classData) => {
        try {
            const response = await api.put(`/classes/${id}`, classData);
            return response.data;
        } catch (error) {
            console.error(`Error updating class with ID ${id}:`, error);
            throw error;
        }
    },

    deleteClass: async (id) => {
        try {
            const response = await api.delete(`/classes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting class with ID ${id}:`, error);
            throw error;
        }
    },
};

export default ClassesServices;
