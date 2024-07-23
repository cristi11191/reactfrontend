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
    role_and_permission_management: {
        component: RolePermissionManagement,
        label: 'Role/Permission',
        icon: UilUser,
        path: '/roleandpermission',
        permissions: {
            role: {
                read: 'read_role',
                create: 'create_role',
                update: 'update_role',
                delete: 'delete_role',
            },
            permission: {
                read: 'read_permission',
                create: 'create_permission',
                update: 'update_permission',
                delete: 'delete_permission',
            }
        }
    },

    // Add more configurations as needed
};

