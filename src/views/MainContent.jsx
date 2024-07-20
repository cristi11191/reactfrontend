
import React from 'react';
import { useLocation } from 'react-router-dom';
import { permissionsConfig } from '../config/permissionsConfig';
import { hasPermission } from '../utils/permissions';

export default function MainContent() {
    const location = useLocation();
    const currentConfig = Object.values(permissionsConfig).find(
        config => config.path === location.pathname
    );

    if (!currentConfig) {
        return <div>Page not found</div>;
    }

    const hasAccess = Object.values(currentConfig.permissions).some(permission => hasPermission(permission));
// eslint-disable-next-line no-debugger
    if (hasAccess) {
        const Component = currentConfig.component;

        return <Component/>
    }

    return <div>You do not have access to this section.</div>;
}

