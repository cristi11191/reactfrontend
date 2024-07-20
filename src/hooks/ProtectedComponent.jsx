// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import { Navigate } from 'react-router-dom';
import {useToasts} from "../contexts/ToastContainer.jsx";
import { fetchUserPermissions } from '../services/apiServices';

// eslint-disable-next-line react/prop-types
const ProtectedComponent = ({ component: Component, permissions }) => {
    const [permissions, setPermissions] = useState([]);
    const { addToast } = useToasts();
    const userPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    // eslint-disable-next-line no-debugger
    debugger;
    useEffect(() => {
        const getPermissions = async () => {
            try {
                const userPermissions = await fetchUserPermissions();
                setPermissions(userPermissions);
            } catch (error) {
                console.error('Failed to fetch permissions', error);
            }
        };

        getPermissions();
    }, []);
    const hasPermission = (requiredPermissions) => {
        return requiredPermissions.every(permission => userPermissions.includes(permission));
    };

    if (!hasPermission(permissions)) {
        return addToast('error','ACCESS DENIED!', 4000);
    }

    return <Component />;
};

export default ProtectedComponent;
