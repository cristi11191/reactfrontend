
export const hasPermission = (requiredPermissions = []) => {

    let permissions = localStorage.getItem('permissions');
    return requiredPermissions.every(permission => permissions.includes(permission));
};
