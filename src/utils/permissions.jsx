

export const hasPermission = (permission) => {
    const permissions = JSON.parse(localStorage.getItem('permissions')) || [];

    return permissions.includes(permission);
};

export const getRole = () => {
    return localStorage.getItem('role');
};