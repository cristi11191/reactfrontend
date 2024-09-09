export const permissionDependencies = {
    'create_user': ['read_user'],
    'update_user': ['read_user'],
    'delete_user': ['read_user'],
    'create_role': ['read_role','read_permission'],
    'update_role': ['read_role','read_permission'],
    'delete_role': ['read_role'],
    'create_permission': ['read_permission'],
    'update_permission': ['read_permission'],
    'delete_permission': ['read_permission'],
    'read_role':['read_permission'],
    'read_permission':['read_role'],
    'create_group':['read_group'],
    'update_group':['read_group'],
    'delete_group':['read_group']
};