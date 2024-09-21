import { UilEstate, UilFilesLandscapes, UilUser } from '@iconscout/react-unicons';
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import AdminPanel from '../components/AdminPanel/AdminPanel.jsx';
import UserManagement from '../components/UserManagements/UserManagement.jsx';
import GroupManagement from '../components/Groups/GroupManagement.jsx';
import RoleManagement from "../components/RoleManagement/RoleManagement.jsx";

export const rolesConfig = {
    admin: {
        label: 'Admin Panel',
        icon: UilEstate,
        path: '/admin',
        component: AdminPanel,
        roles: ['Admin'], // Only admins can access this
    },
    dashboard: {
        label: 'Dashboard',
        icon: UilFilesLandscapes,
        path: '/dashboard',
        component: Dashboard,
        roles: ['Admin', 'Secretary', 'Student', 'Teacher'], // Multiple roles can access this
    },
    user_management: {
        label: 'Manage Users',
        icon: UilUser,
        path: '/users',
        component: UserManagement,
        roles: ['Admin', 'Secretary'], // Only admin and manager can access this
    },
    role_management: {
        label: 'Role Management',
        icon: UilUser,
        path: '/roles',
        component: RoleManagement,
        roles: ['Admin'], // Only admins can manage roles
    },
    group_management: {
        label: 'Manage Groups',
        icon: UilUser,
        path: '/groups',
        component: GroupManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },

    // Add more roles and paths as needed
};
