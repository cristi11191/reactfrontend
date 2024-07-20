// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import {fetchCurrentUser} from "../services/apiServices.jsx";


// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ element, roles }) => {
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getUserRole = async () => {
            try {
                const user = await fetchCurrentUser();
                setCurrentUserRole(user.role.name); // Assuming user.role exists
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setLoading(false);
            }
        };
        getUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    // eslint-disable-next-line react/prop-types
    if (!roles.includes(currentUserRole)) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoutes;