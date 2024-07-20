import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import UsersManagement from "./views/UserManagement.jsx";
import NotFound from "./views/NotFound.jsx";
import GuestLayout from "./layout/GuestLayout.jsx";
import DefaultLayout from "./layout/DefaultLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AdminPanel from "./views/AdminPanel.jsx";
import ProtectedRoutes from "./hooks/ProtectedRoutes.jsx";
import MainContent from "./views/MainContent.jsx";

const router  = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} roles={['Student','Teacher','Admin','Secretary']} />,
        children:[
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<MainContent />} roles={['Student','Admin','Teacher','Secretary']} />
            },
            {
                path: '/users',
                element: <ProtectedRoutes element={<MainContent />} roles={['Admin']} />
            },
            {
                path: '/adminpanel',
                element: <ProtectedRoutes element={<MainContent />} roles={['Admin']} />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children:[
            {
                path: '/login',
                element: <Login />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }

])

export default router