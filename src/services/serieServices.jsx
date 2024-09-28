import api from './apiServices.jsx';

const SeriesServices = {
    fetchSeries: async () => {
        const response = await api.get('/series');
        return response.data;
    },

    getSeriesById: async (id) => {
        const response = await api.get(`/series/${id}`);
        return response.data;
    },

    createSeries: async (seriesData) => {
        const response = await api.post('/series', seriesData);
        return response.data;
    },

    updateSeries: async (id, seriesData) => {
        const response = await api.put(`/series/${id}`, seriesData);
        return response.data;
    },

    deleteSeries: async (id) => {
        const response = await api.delete(`/series/${id}`);
        return response.data;
    },

    // Add a group to a specific series
    addGroupToSeries: async (seriesId, groupId) => {
        const response = await api.post(`/series/${seriesId}/add-group`, { group: groupId });
        return response.data;
    },

    // Remove a group from a specific series
    removeGroupFromSeries: async (seriesId, groupId) => {
        const response = await api.post(`/series/${seriesId}/remove-group`, { group: groupId });
        return response.data;
    },

    // Delete a group from all series
    deleteGroupFromAllSeries: async (groupId) => {
        const response = await api.delete(`/groups/${groupId}/delete-from-series`);
        return response.data;
    }
};

export default SeriesServices;
