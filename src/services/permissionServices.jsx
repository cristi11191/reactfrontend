import api from './apiServices.jsx';

const PermissionServices = {
    fetchPermissions: async () => {
        const response = await api.get('/permissions');
        return response.data;
    },

    getPermissionById: async (id) => {
        const response = await api.get(`/permissions/${id}`);
        return response.data;
    },

    createPermission: async (permissionData) => {
        const response = await api.post('/permissions', permissionData);
        return response.data;
    },

    updatePermission: async (id, permissionData) => {
        const response = await api.put(`/permissions/${id}`, permissionData);
        return response.data;
    },

    deletePermission: async (id) => {
        const response = await api.delete(`/permissions/${id}`);
        return response.data;
    },
};

export default PermissionServices;
