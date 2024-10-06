import api from './apiServices.jsx';

const FacultyServices = {
    fetchFaculties: async () => {
        try {
            const response = await api.get('/faculties');
            return response.data;
        } catch (error) {
            console.error('Error fetching all faculties:', error);
            throw error;
        }
    },

    getFacultyById: async (id) => {
        const response = await api.get(`/faculties/${id}`);
        return response.data;
    },

    createFaculty: async (facultyData) => {
        const response = await api.post('/faculties', facultyData);
        return response.data;
    },

    updateFaculty: async (id, facultyData) => {
        const response = await api.put(`/faculties/${id}`, facultyData);
        return response.data;
    },

    deleteFaculty: async (id) => {
        const response = await api.delete(`/faculties/${id}`);
        return response.data;
    },
};

export default FacultyServices;
