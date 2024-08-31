import api from './apiServices.jsx';

const RoleServices = {
    fetchRoles: async () => {
        const response = await api.get('/roles');
        return response.data;
    },

    fetchRoleById: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    createRole: async (roleData) => {
        const response = await api.post('/roles', roleData);
        return response.data;
    },

    updateRole: async (id, roleData) => {
        const response = await api.put(`/roles/${id}`, roleData);
        return response.data;
    },

    deleteRole: async (id) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
    getRolePermissions: async (id) => {
        const response = await api.get(`/roles/${id}/permissions`);
        return response.data;
    },
    updateRolePermissions: async (id, permissions) => {
        try {
            const response = await api.put(`/roles/${id}/permissions`, { permissions });
            return response.data;
        } catch (error) {
            console.error('Error updating role permissions:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

};

export default RoleServices;
