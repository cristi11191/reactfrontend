import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import NotFound from "./views/NotFound.jsx";
import GuestLayout from "./layout/GuestLayout.jsx";
import DefaultLayout from "./layout/DefaultLayout.jsx";
import ProtectedRoutes from "./hooks/ProtectedRoutes.jsx";
import MainContent from "./views/MainContent.jsx";

const router  = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} />,
        children:[
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<MainContent />} permission={['view_dashboard']} />
            },
            {
                path: '/users',
                element: <ProtectedRoutes element={<MainContent />} permission={['read_user','read_role']}/>
            },
            {
                path: '/roleandpermission',
                element: <ProtectedRoutes element={<MainContent />}/>
            },
            {
                path: '/adminpanel',
                element: <ProtectedRoutes element={<MainContent />} />
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