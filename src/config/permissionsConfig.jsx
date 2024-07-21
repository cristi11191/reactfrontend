// Import your icons and components
import {UilEstate, UilFilesLandscapes, UilUser} from '@iconscout/react-unicons';
import Dashboard from '../views/Dashboard';
import AdminPanel from '../views/AdminPanel';
import UserManagement from '../views/UserManagement'; // Example component
import RolePermissionManagement from '../views/RolePermissionManagement.jsx'

export const permissionsConfig = {

    view_dashboard: {
        component: Dashboard,
        label: 'Dashboard',
        icon: UilFilesLandscapes,
        path: '/dashboard',
        permissions: {
            read: 'view_dashboard',
        }
    },
    view_adminpanel: {
        component: AdminPanel,
        label: 'Admin Panel',
        icon: UilEstate,
        path: '/adminpanel',
        permissions: {
            read: 'view_adminpanel',
        }
    },
    user_management: {
        component: UserManagement,
        label: 'Manage Users',
        icon: UilUser,
        path: '/users',
        permissions: {
            read: 'read_user',
            create: 'create_user',
            update: 'update_user',
            delete: 'delete_user',
        }
    },
    roleandpermission_management: {
        component: RolePermissionManagement,
        label: 'Role/Permission',
        icon: UilUser,
        path: '/roleandpermission',
        permissions: {
            role_read: 'read_role',
            role_create: 'create_role',
            role_update: 'update_role',
            role_delete: 'delete_role',
            permission_read: 'read_permission',
            permission_create: 'create_permission',
            permission_update: 'update_permission',
            permission_delete: 'delete_permission',
        }
    },
    // Add more configurations as needed
};

