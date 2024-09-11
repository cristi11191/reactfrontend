// src/components/Navbar.js
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import logo from '../../assets/logo.png';
import {UilBag, UilMoon, UilSignout} from '@iconscout/react-unicons';
import useDarkMode from '../../hooks/useDarkMode.jsx';
import Avatar from '@mui/material/Avatar';
import '../../styles/styles.css'
import { permissionsConfig } from '../../config/permissionsConfig.jsx';
import { hasPermission } from '../../utils/permissions.jsx';

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [isManagementOpen, setIsManagementOpen] = useState(false); // State to handle collapse/expand

    // Function to toggle collapse state
    const toggleManagementMenu = () => {
        console.log(isManagementOpen);
        setIsManagementOpen(!isManagementOpen);
    };

    // Function to check if a permission exists for a specific action key
    const checkPermission = (permissions, actionKey) => {
        if (!permissions || !actionKey) return false;

        // Extract the permission value for the actionKey
        const permissionValue = permissions[actionKey];
        if (!permissionValue) return false;

        // Check if the user has the extracted permission
        return hasPermission([permissionValue]);
    };

    // Filter out management-related links with required permissions
    const managementLinks = [
        { key: 'user_management', label: 'Manage Users', path: permissionsConfig.user_management.path, permissionKey: 'user_management', icon: permissionsConfig.user_management.icon },
        { key: 'group_management', label: 'Manage Groups', path: permissionsConfig.group_management.path, permissionKey: 'group_management', icon: permissionsConfig.group_management.icon },
        { key: 'role_and_permission_management', label: 'Role/Permission    ', path: permissionsConfig.role_and_permission_management.path, permissionKey: 'role_and_permission_management', icon: permissionsConfig.role_and_permission_management.icon },
    ].filter(link => {
        // Get the permissions object for the current link
        const linkPermissions = permissionsConfig[link.permissionKey]?.permissions;

        // If the permissions are nested in 'permission', check it
        if (linkPermissions?.permission) {
            return checkPermission(linkPermissions.permission, 'read');
        }

        // Otherwise, check the top-level permissions object
        return checkPermission(linkPermissions, 'read');
    });


    const handleLogout = () => {
        // Clear user authentication data (e.g., tokens)
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
        navigate('/login');
    };
    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    return (
        <nav>
            <div className="logo-name">
                <div className="logo-image">
                    <Avatar alt="Remy Sharp" src={logo}/>
                </div>
                <span className="logo_name"
                      id="username">{localStorage.getItem('role') === 'Admin' ? 'Administrator' : 'WebStudent'}</span>
            </div>
            <div className="menu-items">
                <ul className="nav-links">
                    {/* Regular non-management links */}
                    {Object.entries(permissionsConfig).map(([key, config]) => {
                        const canRead = checkPermission(config.permissions, 'read');
                        if (canRead && !['user_management', 'group_management', 'role_and_permission_management'].includes(key)) {
                            const IconComponent = config.icon;
                            return (
                                <li key={key}>
                                    <Link to={config.path}>
                                        <IconComponent className="nav-imgs" />
                                        <span className="link-name">{config.label}</span>
                                    </Link>
                                </li>
                            );
                        }
                        return null;
                    })}

                    {/* Management menu */}
                    {managementLinks.length > 0 && (
                        <li>

                            <a onClick={toggleManagementMenu} className="management-toggle link-name ">
                                {/* Icon for Management */}
                                <UilBag className="nav-imgs"/>
                                <span className="link-name">Management</span>
                            </a>
                            {isManagementOpen && (
                                <ul className="collapsed-management-links nav-links">
                                    {managementLinks.map(link => (
                                        <li key={link.key}>
                                            <Link to={link.path}>
                                                <link.icon className="nav-imgs"/>
                                                <span className="link-name">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )}
                </ul>
                <ul className="logout-mode">


                    <li><a href="#" onClick={handleLogout}><UilSignout className="nav-imgs"/><span
                        className="link-name">Logout</span></a></li>
                    <li className="mode">
                        <a onClick={toggleDarkMode}><UilMoon className="nav-imgs"/><span
                            className="link-name">Dark Mode</span></a>
                        <div className="mode-toggle" onClick={toggleDarkMode}><span className="switch"></span></div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
