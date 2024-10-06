import api from './apiServices.jsx';

const SpecialityServices = {
    // Fetch all specialities
    fetchSpecialities: async () => {
        try {
            const response = await api.get('/specialities');
            return response.data;
        } catch (error) {
            console.error('Error fetching all specialities:', error);
            throw error;
        }
    },

    // Fetch a single speciality by ID
    getSpecialityById: async (id) => {
        const response = await api.get(`/specialities/${id}`);
        return response.data;
    },

    // Fetch specialities by faculty ID
    getSpecialitiesByFacultyId: async (faculty_id) => {
        try {
            const response = await api.get(`/specialities/faculty/${faculty_id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching specialities for faculty ID ${faculty_id}:`, error);
            throw error;
        }
    },

    // Create a new speciality
    createSpeciality: async (specialityData) => {
        const response = await api.post('/specialities', specialityData);
        return response.data;
    },

    // Update an existing speciality
    updateSpeciality: async (id, specialityData) => {
        const response = await api.put(`/specialities/${id}`, specialityData);
        return response.data;
    },

    // Delete a speciality
    deleteSpeciality: async (id) => {
        const response = await api.delete(`/specialities/${id}`);
        return response.data;
    }
};

export default SpecialityServices;
