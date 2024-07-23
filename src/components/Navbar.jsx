// src/components/Navbar.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import logo from '../assets/logo.png';
import { UilMoon, UilSignout} from '@iconscout/react-unicons';
import useDarkMode from '../hooks/useDarkMode';
import Avatar from '@mui/material/Avatar';
import '../styles/styles.css'
import { permissionsConfig } from '../config/permissionsConfig';
import { hasPermission } from '../utils/permissions';

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();

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
                    <Avatar alt="Remy Sharp" src={logo} />
                </div>
                <span className="logo_name" id="username">{localStorage.getItem('role')==='Admin' ? 'Administrator' : 'WebStudent'}</span>
            </div>
            <div className="menu-items">
                <ul className="nav-links">
                    {Object.entries(permissionsConfig).map(([key, config]) => {
                        // Check if the user has any required permissions for this section
                        const hasAccess = (permissions) => {
                            if (!permissions) return false;

                            return Object.values(permissions).some(permissionSet => {
                                if (typeof permissionSet === 'string') {
                                    return hasPermission([permissionSet]);
                                }
                                return Object.values(permissionSet).some(permission => hasPermission(permission));
                            });
                        };


                        if (hasAccess) {
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
