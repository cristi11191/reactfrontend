import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import '../styles/styles.css'
import {UilBars} from "@iconscout/react-unicons";
import SearchBox from "../components/SearchBar.jsx";
import useSidebar from "../hooks/useSidebar.jsx";
import ANavbar from "../components/ANavbar.jsx";

export default function DefaultLayout() {
    const [isSidebarOpen, toggleSidebar] = useSidebar();

    const getUserRole = () => {
        try {
            const userRole = localStorage.getItem('role');
            return userRole;
        } catch (error) {
            console.error("Error fetching user role:", error);
            return null;
        }
    };


    // Check if user is authenticated (JWT token present)
    if (!localStorage.getItem('token')) {
        // Redirect to login page using Navigate
        return <Navigate to="/login" />;
    }

    const userRole = getUserRole();

    return (
        <section className={`dashboard ${isSidebarOpen ? '' : 'close'}`}>
            <div className={`top ${isSidebarOpen ? '' : 'close'}`}>
                {userRole === 'Admin' ? <ANavbar /> : <Navbar />}
                <UilBars className="sidebar-toggle" onClick={toggleSidebar}/>
                <SearchBox/>
            </div>
            <div className="dash-content">
                <Outlet/>
            </div>
        </section>
    )
}