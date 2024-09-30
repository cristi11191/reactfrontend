import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/NavBar/Navbar.jsx";
import '../styles/styles.css'
import {UilBars} from "@iconscout/react-unicons";
import SearchBox from "../components/SearchBar/SearchBar.jsx";
import useSidebar from "../hooks/useSidebar.jsx";
import '../components/Dashboard/dashboard.css'

export default function DefaultLayout() {
    const [isSidebarOpen, toggleSidebar] = useSidebar();



    // Check if user is authenticated (JWT token present)
    if (!localStorage.getItem('token')) {
        // Redirect to login page using Navigate
        return <Navigate to="/login" />;
    }


    return (
        <section className={`dashboard ${isSidebarOpen ? '' : 'close'}`}>
            <div className={`top ${isSidebarOpen ? '' : 'close'}`}>
                {/* Use <aside> for the sidebar (Navbar) */}
                    <Navbar/>
                {/* Sidebar toggle button */}
                <UilBars className="sidebar-toggle" onClick={toggleSidebar}/>
                {/* Search Box Component */}
                <SearchBox/>
            </div>
            <div className="dash-content">
                <Outlet/>
            </div>
        </section>

    )
}