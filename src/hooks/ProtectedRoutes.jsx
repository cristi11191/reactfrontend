// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react'
import { Navigate } from 'react-router-dom'
import {fetchCurrentUser} from "../services/apiServices.jsx";
import {hasPermission} from "../utils/permissions.jsx";
import {permissionsConfig} from "../config/permissionsConfig.jsx";
import flattenPermissions from "../utils/flattenPermissions.jsx"


// eslint-disable-next-line react/prop-types
const ProtectedRoutes = ({ element, permission = [] }) => {
    const [currentUserPermissions, setCurrentUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
 useEffect(() => {
            const getUserPermissions = async () => {
                try {
                    const user = await fetchCurrentUser();

                    let permissions = user.role.permissions;

                    // Check if permissions is an object or an array
                    if (typeof permissions === 'object' && permissions !== null) {
                        // Flatten permissions if it's an object
                        permissions = flattenPermissions(permissions);
                    } else if (Array.isArray(permissions)) {
                        // Directly use permissions if it's already an array
                        permissions = flattenPermissions(permissions);
                    }

                    setCurrentUserPermissions(permissions);
                } catch (error) {
                    console.error('Error fetching user permissions:', error);
                } finally {
                    setLoading(false);
                }
            };
            getUserPermissions();
        }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }
    // eslint-disable-next-line no-debugger
    debugger;

    if (permission.length === 0) {
        return element;
    }
    // eslint-disable-next-line react/prop-types
    const userHasPermission = hasPermission(permission);


    if (!userHasPermission) {
        return <div>You do not have access to this section.</div>;
    }

    return element;
};

export default ProtectedRoutes;