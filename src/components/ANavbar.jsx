// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import logo from '../assets/logo.png';
import { UilMoon, UilSignout, UilEstate,  UilUser } from '@iconscout/react-unicons';
import useDarkMode from '../hooks/useDarkMode';
import Avatar from '@mui/material/Avatar';

const Navbar = () => {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
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
                    <Avatar alt="Remy Sharp" src={logo} />
                </div>
                <span className="logo_name" id="username">Admin Panel</span>
            </div>
            <div className="menu-items">
                <ul className="nav-links">
                    <li><Link to="/dashboard"><UilEstate className="nav-imgs"/><span
                        className="link-name">Dashboard</span></Link></li>
                    <li><Link to="/adminpanel"><UilEstate className="nav-imgs"/><span
                        className="link-name">Admin Panel</span></Link></li>
                    <li><Link to="/users"><UilUser className="nav-imgs"/><span className="link-name">Users</span></Link>
                    </li>
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
