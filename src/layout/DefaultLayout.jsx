import {Navigate, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import '../styles/styles.css'
import {UilBars} from "@iconscout/react-unicons";
import SearchBox from "../components/SearchBar.jsx";
import useSidebar from "../hooks/useSidebar.jsx";

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
                <Navbar />
                <UilBars className="sidebar-toggle" onClick={toggleSidebar}/>
                <SearchBox/>
            </div>
            <div className="dash-content">
                <Outlet/>
            </div>
        </section>
    )
}