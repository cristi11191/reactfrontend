// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { UilBag, UilMoon, UilSignout } from '@iconscout/react-unicons';
import useDarkMode from '../../hooks/useDarkMode.jsx';
import Avatar from '@mui/material/Avatar';
import '../../styles/styles.css';
import { rolesConfig } from '../../config/rolesConfig.jsx';

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [isManagementOpen, setIsManagementOpen] = useState(false); // State to handle collapse/expand

    const currentUserRole = localStorage.getItem('role'); // Retrieve current user role

    // Function to toggle collapse state
    const toggleManagementMenu = () => {
        setIsManagementOpen(!isManagementOpen);
    };

    // Filter out management-related links based on roles
    const managementLinks = [
        rolesConfig.user_management,
        rolesConfig.group_management,
        rolesConfig.role_management,
    ].filter(link => link.roles.includes(currentUserRole));

    const handleLogout = () => {
        // Clear user authentication data (e.g., tokens)
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    return (
        <nav>
            <div className="logo-name">
                <div className="logo-image">
                    <Avatar alt="Logo" src={logo} />
                </div>
                <span className="logo_name" id="username">
                    {currentUserRole === 'admin' ? 'Administrator' : currentUserRole}
                </span>
            </div>
            <div className="menu-items">
                <ul className="nav-links">
                    {/* Regular non-management links */}
                    {Object.entries(rolesConfig).map(([key, config]) => {
                        if (config.roles.includes(currentUserRole) && !['user_management', 'group_management', 'role_management'].includes(key)) {
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
                            <a onClick={toggleManagementMenu} className="management-toggle link-name">
                                <UilBag className="nav-imgs" />
                                <span className="link-name">Management</span>
                            </a>
                            {isManagementOpen && (
                                <ul className="collapsed-management-links nav-links">
                                    {managementLinks.map(link => (
                                        <li key={link.path}>
                                            <Link to={link.path}>
                                                <link.icon className="nav-imgs" />
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
                    <li>
                        <a href="#" onClick={handleLogout}>
                            <UilSignout className="nav-imgs" />
                            <span className="link-name">Logout</span>
                        </a>
                    </li>
                    <li className="mode">
                        <a onClick={toggleDarkMode}>
                            <UilMoon className="nav-imgs" />
                            <span className="link-name">Dark Mode</span>
                        </a>
                        <div className="mode-toggle" onClick={toggleDarkMode}>
                            <span className="switch"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
