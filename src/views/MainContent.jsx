
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { rolesConfig } from '../config/rolesConfig.jsx'; // Assuming you have a rolesConfig file

export default function MainContent() {
    // Match the current route path with the configuration
    const currentConfig = Object.values(rolesConfig).find(
        config => config.path === location.pathname
    );

    // Extract the component associated with the path, fallback to a default if not found
    const Component = currentConfig ? currentConfig.component : DefaultComponent;

    return <Component />;
}

