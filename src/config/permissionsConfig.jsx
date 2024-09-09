// Import your icons and components
import {UilEstate, UilFilesLandscapes, UilUser} from '@iconscout/react-unicons';
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import AdminPanel from '../components/AdminPanel/AdminPanel.jsx';
import UserManagement from '../components/UserManagements/UserManagement.jsx'; // Example component
import RolePermissionManagement from '../components/RolePermissionManagement/RolePermissionManagement.jsx'
import GroupManagement from "../components/Groups/GroupManagement.jsx";

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
    view_admin: {
        component: AdminPanel,
        label: 'Admin Panel',
        icon: UilEstate,
        path: '/admin',
        permissions: {
            read: 'view_admin',
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
        path: '/roles',
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
    group_management: {
        component: GroupManagement,
        label: 'Manage Groups',
        icon: UilUser,
        path: '/groups',
        permissions: {
            read: 'read_group',
            create: 'create_group',
            update: 'update_group',
            delete: 'delete_group',
        }
    },

    // Add more configurations as needed
};

