import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import Users from "./views/Users.jsx";
import NotFound from "./views/NotFound.jsx";
import GuestLayout from "./layout/GuestLayout.jsx";
import DefaultLayout from "./layout/DefaultLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AdminPanel from "./views/AdminPanel.jsx";
import ProtectedRoutes from "./hooks/ProtectedRoutes.jsx";

const router  = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} roles={['Student','Teacher','Admin']} />,
        children:[
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<Dashboard />} roles={['Student','Admin','Teacher']} />
            },
            {
                path: '/users',
                element: <ProtectedRoutes element={<Users />} roles={['Admin']} />
            },
            {
                path: '/adminpanel',
                element: <ProtectedRoutes element={<AdminPanel />} roles={['Admin']} />
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