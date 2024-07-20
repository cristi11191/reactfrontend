// src/components/Navbar.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png';
import { UilMoon, UilSignout, UilEstate, UilFilesLandscapes, UilChart, UilThumbsUp, UilComments, UilShare } from '@iconscout/react-unicons';
import useDarkMode from '../hooks/useDarkMode';
import Avatar from '@mui/material/Avatar';
import '../styles/styles.css'

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user authentication data (e.g., tokens)
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav>
            <div className="logo-name">
                <div className="logo-image">
                    <Avatar alt="Remy Sharp" src={logo} />
                </div>
                <span className="logo_name" id="username">WebStudent</span>
            </div>
            <div className="menu-items">
                <ul className="nav-links">
                    <li><Link to="/dashboard"><UilEstate className="nav-imgs"/><span className="link-name">Dashboard</span></Link></li>
                    <li><a href="#"><UilFilesLandscapes className="nav-imgs"/><span className="link-name">Content</span></a></li>
                    <li><a href="#"><UilChart className="nav-imgs"/><span className="link-name">Analytics</span></a></li>
                    <li><a href="#"><UilThumbsUp className="nav-imgs"/><span className="link-name">Like</span></a></li>
                    <li><a href="#"><UilComments className="nav-imgs"/><span className="link-name">Comment</span></a></li>
                    <li><a href="#"><UilShare className="nav-imgs"/><span className="link-name">Share</span></a></li>
                </ul>
                <ul className="logout-mode">
                    <li><a href="#" onClick={handleLogout}><UilSignout className="nav-imgs"/><span className="link-name">Logout</span></a></li>
                    <li className="mode">
                        <a onClick={toggleDarkMode}><UilMoon className="nav-imgs" /><span className="link-name">Dark Mode</span></a>
                        <div className="mode-toggle" onClick={toggleDarkMode}><span className="switch"></span></div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
