import {UilBook, UilEstate, UilFilesLandscapes, UilUser} from '@iconscout/react-unicons';
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import AdminPanel from '../components/AdminPanel/AdminPanel.jsx';
import UserManagement from '../components/UserManagements/UserManagement.jsx';
import GroupManagement from '../components/Groups/GroupManagement.jsx';
import RoleManagement from "../components/RoleManagement/RoleManagement.jsx";
import SeriesManagement from "../components/Series/SeriesManagement.jsx";
import FacultiesManagement from "../components/Faculties/FacultiesManagement.jsx";
import SpecialitiesManagement from "../components/Specialities/SpecialitiesManagement.jsx";
import ClassesManagement from "../components/Classes/ClassesManagement.jsx";

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
        label: 'Users',
        icon: UilUser,
        path: '/users',
        component: UserManagement,
        roles: ['Admin'], // Only admin and manager can access this
    },
    role_management: {
        label: 'Roles',
        icon: UilUser,
        path: '/roles',
        component: RoleManagement,
        roles: ['Admin'], // Only admins can manage roles
    },
    group_management: {
        label: 'Groups',
        icon: UilUser,
        path: '/groups',
        component: GroupManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },
    serie_management: {
        label: 'Series',
        icon: UilUser,
        path: '/series',
        component: SeriesManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },
    faculties_management: {
        label: 'Faculties',
        icon: UilUser,
        path: '/faculties',
        component: FacultiesManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },
    specialities_management: {
        label: 'Specialities',
        icon: UilUser,
        path: '/specialities',
        component: SpecialitiesManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },
    classes_management: {
        label: 'Classes',
        icon: UilBook,
        path: '/classes',
        component: ClassesManagement,
        roles: ['Admin', 'Secretary'], // Admin and manager roles can access group management
    },

    // Add more roles and paths as needed
};
