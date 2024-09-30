// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import {fetchCurrentUser} from "../services/apiServices.jsx";

// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ element, role = [] }) => {
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            try {
                const user = await fetchCurrentUser();
                setCurrentUserRole(user.role.name); // Assuming role has a 'name' property
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

    if (role.length === 0) {
        return element;
    }

    // Check if the current user has one of the required roles
    const userHasRole = role.includes(currentUserRole);

    if (!userHasRole) {
        return <div
            style={{marginTop: '100px', color: 'red', textAlign: 'center', fontSize: '18px', fontWeight: 'bold'}}>
            You do not have access to this section.
        </div>;
    }

    return element;
};

export default ProtectedRoutes;
