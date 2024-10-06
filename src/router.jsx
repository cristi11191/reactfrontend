import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import NotFound from "./views/NotFound.jsx";
import GuestLayout from "./layout/GuestLayout.jsx";
import DefaultLayout from "./layout/DefaultLayout.jsx";
import ProtectedRoutes from "./hooks/ProtectedRoutes.jsx";
import MainContent from "./views/MainContent.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes element={<DefaultLayout />} />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary', 'Student', 'Teacher']} />
            },
            {
                path: '/users',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin']} />
            },
            {
                path: '/roles',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin']} />
            },
            {
                path: '/admin',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin']} />
            },
            {
                path: '/groups',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary']} />
            },
            {
                path: '/series',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary']} />
            },
            {
                path: '/faculties',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary']} />
            },
            {
                path: '/specialities',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary']} />
            },
            {
                path: '/classes',
                element: <ProtectedRoutes element={<MainContent />} role={['Admin', 'Secretary']} />
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
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
]);

export default router;
