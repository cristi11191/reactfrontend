export const permissionDependencies = {
    'create_user': ['read_user'],
    'update_user': ['read_user'],
    'delete_user': ['read_user'],
    'create_role': ['read_role'],
    'update_role': ['read_role'],
    'delete_role': ['read_role'],
    'create_permission': ['read_permission'],
    'update_permission': ['read_permission'],
    'delete_permission': ['read_permission']
};