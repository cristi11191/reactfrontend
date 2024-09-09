import api from './apiServices.jsx';

const GroupServices = {
    fetchGroup: async () => {
        const response = await api.get('/groups');
        return response.data;
    },

    getGroupById: async (id) => {
        const response = await api.get(`/groups/${id}`);
        return response.data;
    },

    createGroup: async (groupsData) => {
        const response = await api.post('/groups', groupsData);
        return response.data;
    },

    updateGroup: async (id, groupsData) => {
        const response = await api.put(`/groups/${id}`, groupsData);
        return response.data;
    },

    deleteGroup: async (id) => {
        const response = await api.delete(`/groups/${id}`);
        return response.data;
    },
};

export default GroupServices;