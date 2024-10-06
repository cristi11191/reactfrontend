// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UilBag, UilMoon, UilSignout, UilBuilding } from '@iconscout/react-unicons';
import useDarkMode from '../../hooks/useDarkMode.jsx';
import '../../styles/styles.css';
import { rolesConfig } from '../../config/rolesConfig.jsx';

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [isManagementOpen, setIsManagementOpen] = useState(false); // State to handle collapse/expand for management
    const [isUniversityOpen, setIsUniversityOpen] = useState(false); // State to handle collapse/expand for university
    const currentUserRole = localStorage.getItem('role'); // Retrieve current user role

    // Function to toggle collapse state for management
    const toggleManagementMenu = () => {
        setIsManagementOpen(!isManagementOpen);
    };

    // Function to toggle collapse state for university
    const toggleUniversityMenu = () => {
        setIsUniversityOpen(!isUniversityOpen);
    };

    // Management-related links
    const managementLinks = [
        rolesConfig.user_management,
        rolesConfig.role_management
    ].filter(link => link.roles.includes(currentUserRole));

    // University-related links
    const universityLinks = [
        rolesConfig.group_management,
        rolesConfig.serie_management,
        rolesConfig.faculties_management,
        rolesConfig.specialities_management,
        rolesConfig.classes_management
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
            <div className="menu-items">
                <ul className="nav-links">
                    {/* Regular non-management and non-university links */}
                    {Object.entries(rolesConfig).map(([key, config]) => {
                        if (config.roles.includes(currentUserRole) && !['user_management', 'group_management', 'role_management', 'serie_management', 'faculties_management', 'specialities_management', 'classes_management'].includes(key)) {
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

                    {/* University tab */}
                    {universityLinks.length > 0 && (
                        <li>
                            <a onClick={toggleUniversityMenu} className="university-toggle link-name">
                                <UilBuilding className="nav-imgs" />
                                <span className="link-name">University</span>
                            </a>
                            {isUniversityOpen && (
                                <ul className="collapsed-university-links nav-links">
                                    {universityLinks.map(link => (
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

                    {/* Management tab */}
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

                {/* Logout and Dark Mode */}
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
